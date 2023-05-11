import datetime
import json
import uuid
from typing import Optional

from flask import g, jsonify
from flask_openapi3 import APIBlueprint
from pydantic import BaseModel
from requests import get

from server.models.game import Game, Guess
from server.models.stats import Stats
from server.secret_manager import Secrets
from server.word_list import WORDS

api = APIBlueprint("/game", __name__, url_prefix="/game")


@api.get("/start")
def start_game():
    user = g.current_user

    if not user:
        return jsonify(status="unauthorized", message="Login required")

    level = max(user.level, 1)
    index = level - 1

    if index >= len(WORDS):
        return jsonify(status="ok", message="You've beat the game!")

    last_game = Game.get(user_id=user.user_id)
    if last_game and last_game.finished_at is None:
        return jsonify(status="ok", game=last_game.dict(), is_new=False)

    new_game = Game(
        game_id=str(uuid.uuid4()),
        user_id=user.user_id,
        word=WORDS[index].upper(),
    )
    new_game.save()

    return jsonify(status="ok", game=new_game.dict(), is_new=True)


class GameRequest(BaseModel):
    game_id: str
    finished_at: Optional[datetime.datetime]
    solved_row: Optional[int]


@api.get("/stop")
def update_game(query: GameRequest):
    user = g.current_user

    if not user:
        return jsonify(status="unauthorized", message="Login required")

    game = Game.get(user_id=user.user_id, game_id=query.game_id)

    if not game:
        return jsonify(status="error", message="Game not found")

    game.finished_at = query.finished_at
    game.solved_row = query.solved_row

    game.save()

    # Move the user to the next level.
    g.current_user.level += 1
    g.current_user.save()

    # Update stats
    user_stats = Stats.get(user_id=user.user_id)
    user_stats.games_played += 1

    if query.solved_row:
        user_stats.current_streak += 1
        user_stats.longest_streak = max(user_stats.longest_streak, user_stats.current_streak)
        user_distribution = user_stats.distribution_dict
        user_distribution[str(query.solved_row)] += 1
        user_stats.distribution = json.dumps(user_distribution)
    else:
        user_stats.current_streak = 0

    user_stats.save()

    return jsonify(
        status="ok",
        game=game.dict(),
        user=g.current_user.dict(exclude={"credentials", "write_ts"}),
        stats=user_stats.dict(exclude={"write_ts"}),
    )


class GuessRequest(BaseModel):
    game_id: Optional[str]
    guess: Optional[str]
    is_correct: Optional[bool]


@api.get("/guess/list")
def list_guesses(query: GuessRequest):
    user = g.current_user

    if not user:
        return jsonify(status="unauthorized", message="Login required")

    # Generates a list of dicts from whatever previous guesses exist in reverse order since they're returned by
    # write_ts in DESC order.
    guess_list = [
        guess.dict(exclude={"game_id", "correct", "guess_id"}) for guess in Guess.get_all(game_id=query.game_id)[::-1]]

    return jsonify(status="ok", guess_list=guess_list)


@api.get("/guess/submit")
def submit_guess(query: GuessRequest):
    user = g.current_user

    if not user:
        return jsonify(status="unauthorized", message="Login required")

    if not query.guess or query.is_correct is None:
        return jsonify(status="error", message="Missing required fields")

    response = get(
        f"https://dictionaryapi.com/api/v3/references/collegiate/json/{query.guess}",
        params=dict(
            key=Secrets().get("DICTIONARY_API_KEY")
        )
    )

    data = response.json()

    if len(data) == 0 or type(data[0]) != dict:
        return jsonify(status="ok", is_in_dictionary=False)

    Guess(
        game_id=query.game_id,
        guess_id=str(uuid.uuid4()),
        guess=query.guess,
        correct=query.is_correct,
    ).save()

    return jsonify(status="ok")
