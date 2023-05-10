from dotenv import load_dotenv
load_dotenv()

from gevent import monkey
monkey.patch_all()
import grpc._cython.cygrpc
grpc._cython.cygrpc.init_grpc_gevent()

from flask_jwt_extended.exceptions import JWTExtendedException
from jwt import PyJWTError

from server.models.user import User

from server.secret_manager import Secrets

from flask_jwt_extended import JWTManager, verify_jwt_in_request, get_jwt_identity
from flask_openapi3 import OpenAPI, APIBlueprint
from flask import jsonify, redirect, g

from server.api.auth import api as auth_api
from server.api.user import api as user_api
from server.api.game import api as game_api

app = OpenAPI(__name__, doc_ui=True, doc_prefix="/docs")

app.config["JWT_SECRET_KEY"] = Secrets().get("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = True
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_CSRF_CHECK_FORM'] = True

jwt = JWTManager(app)

api = APIBlueprint("/api", __name__, url_prefix="/api")
api.register_api(auth_api)
api.register_api(user_api)
api.register_api(game_api)


@app.before_request
def load_user():
    g.current_user = None
    try:
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity and identity.get("user_id"):
            user = User.get(user_id=identity["user_id"])
            if user:
                g.current_user = user
    except (JWTExtendedException, PyJWTError) as e:
        print(e)
        pass


@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return redirect("/w/")


@api.get("/ping")
def ping():
    return jsonify(status="ok")


app.register_api(api)


if __name__ == "__main__":
    app.run(debug=True, load_dotenv=True)
