import uuid

from flask import g, jsonify
from flask_openapi3 import APIBlueprint


from server.models.game import Game
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
