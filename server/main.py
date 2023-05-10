from dotenv import load_dotenv
load_dotenv()


from flask_jwt_extended import JWTManager
from flask_openapi3 import OpenAPI, APIBlueprint
from flask import jsonify


app = OpenAPI(__name__, doc_ui=True, doc_prefix="/docs")

jwt = JWTManager(app)

api = APIBlueprint("/api", __name__, url_prefix="/api")


@api.get("/ping")
def ping():
    return jsonify(status="ok")


app.register_api(api)


if __name__ == "__main__":
    app.run(debug=True, load_dotenv=True)
