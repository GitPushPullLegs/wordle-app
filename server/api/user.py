from flask import jsonify, g
from flask_openapi3 import APIBlueprint

from server.models.stats import Stats

api = APIBlueprint("/user", __name__, url_prefix="/user")


@api.get("/")
def get_user():
    user = g.current_user
    if user:
        return jsonify(status="ok", user=g.current_user.dict(exclude={"credentials", "write_ts"}))

    return jsonify(status="unauthorized")


@api.get("/stats")
def get_stats():
    user = g.current_user
    if not user:
        return jsonify(status="unauthorized", message="Login required")

    stats = Stats.get(user_id=user.user_id)  # A stats object is always created when a user is created.

    return jsonify(status="ok", stats=stats.dict(exclude={"write_ts"}))
