import datetime
import uuid
from typing import Optional

from flask import g, jsonify
from flask_openapi3 import APIBlueprint
from pydantic import BaseModel


from server.models.game import Game, Guess
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

    # TODO: I don't like storing the stats in the user model.

    g.current_user.level += 1

    if query.solved_row:
        g.current_user.current_streak += 1
        g.current_user.longest_streak = max(g.current_user.longest_streak, g.current_user.current_streak)
    else:
        g.current_user.current_streak = 0

    g.current_user.save()

    return jsonify(status="ok", game=game.dict(), user=g.current_user.dict(exclude={"credentials", "write_ts"}))


class GuessRequest(BaseModel):
    game_id: str

    # The following are optional because we use this same request model to list previous requests.
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

    if not query.guess or not query.is_correct:
        return jsonify(status="error", message="Missing required fields")

    Guess(
        game_id=query.game_id,
        guess_id=str(uuid.uuid4()),
        guess=query.guess,
        correct=query.is_correct,
    ).save()

    return jsonify(status="ok")