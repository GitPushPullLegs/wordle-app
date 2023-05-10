from dotenv import load_dotenv
load_dotenv()

from server.secret_manager import Secrets

from flask_jwt_extended import JWTManager
from flask_openapi3 import OpenAPI, APIBlueprint
from flask import jsonify

from server.api.auth import api as auth_api
from server.api.user import api as user_api

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


@api.get("/ping")
def ping():
    return jsonify(status="ok")


app.register_api(api)


if __name__ == "__main__":
    app.run(debug=True, load_dotenv=True)
