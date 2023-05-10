from flask import jsonify, g
from flask_openapi3 import APIBlueprint


api = APIBlueprint("/user", __name__, url_prefix="/user")


@api.get("/")
def get_user():
    user = g.current_user
    if user:
        return jsonify(status="ok", user=g.current_user.dict(exclude={"credentials", "write_ts"}))

    return jsonify(status="unauthorized")
