import json
import datetime

from flask import jsonify, url_for, request, redirect, session
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies
from flask_openapi3 import APIBlueprint, Tag
from requests_oauthlib import OAuth2Session

from dotenv import load_dotenv

from server.models.user import User

load_dotenv()

from server.secret_manager import Secrets


api = APIBlueprint("/auth", __name__, url_prefix="/auth")

SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.profile",
]

client_id = Secrets().get("GOOGLE_CLIENT_ID")
client_secret = Secrets().get("GOOGLE_CLIENT_SECRET")


@api.get("/login")
def login():
    oauth_session = OAuth2Session(
        client_id=client_id,
        redirect_uri=url_for('/api./auth.google_oauth_callback', _external=True),
        scope=SCOPES
    )

    authorization_url, state = oauth_session.authorization_url(
        "https://accounts.google.com/o/oauth2/auth",
        prompt="consent" if request.args.get("prompt") else None,
        access_type='offline',
        include_granted_scopes="true")
    return redirect(authorization_url)


@api.get("/google/callback")
def google_oauth_callback():
    error = request.args.get("error")
    if error:
        return jsonify(status="error", message=error)

    # Create the OAuth2Session and get the authorization token.
    oauth_session = OAuth2Session(
        client_id=client_id,
        redirect_uri=url_for('/api./auth.google_oauth_callback', _external=True),
        scope=SCOPES
    )
    token = oauth_session.fetch_token(
        "https://accounts.google.com/o/oauth2/token",
        client_secret=client_secret,
        authorization_response=request.url)

    # Get the user's info.
    r = oauth_session.get("https://www.googleapis.com/oauth2/v1/userinfo")
    user_info = r.json()

    # Try to get the user from the database.
    user = User.get(user_id=user_info["id"])

    if user:
        if "refresh_token" in token:
            # Update the user's refresh token.
            print("Found user but had to refresh token.")
            user.first_name = user_info.get("given_name")
            user.last_name = user_info.get("family_name")
            user.full_name = user_info.get("name")
            user.credentials = json.dumps(dict(
                refresh_token=token["refresh_token"],
                scopes=token["scope"],
            ))
        # if the user's refresh token is expired or revoked, redirect them to login.
        elif not json.loads(user.credentials).get("refresh_token") and "refresh_token" not in token:
            return redirect(url_for('/api./auth.login', prompt='true'))
    # If the user doesn't exist, create a new one.
    else:
        if "refresh_token" not in token:
            print("Strange, this should never happen.")
            return redirect(url_for('/api./auth.login', prompt='true'))
        else:
            # Brand-new user
            user = User(
                user_id=user_info["id"],
                first_name=user_info.get("given_name"),
                last_name=user_info.get("family_name"),
                full_name=user_info.get("name"),
                level=1,
                credentials=json.dumps(dict(
                    refresh_token=token["refresh_token"],
                    scopes=token["scope"],
                ))
            )

    user.save()

    access_token = create_access_token(
        identity={"user_id": user.user_id},
        expires_delta=datetime.timedelta(days=1, hours=12),
    )

    # Set the access token in the cookies and redirect to the destination.
    resp = redirect("/play")
    set_access_cookies(resp, access_token)

    return resp


@api.get("/logout")
def logout():
    resp = redirect("/")
    unset_jwt_cookies(resp)
    return resp
