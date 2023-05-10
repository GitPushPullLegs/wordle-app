import json
from typing import Optional

from google.oauth2.credentials import Credentials

from server.models.base import Base
from server.secret_manager import Secrets


class User(Base):
    __table__ = "user"

    user_id: str
    first_name: Optional[str]  # TODO: Encrypt
    last_name: Optional[str]  # TODO: Encrypt
    full_name: Optional[str]  # TODO: Encrypt
    credentials: str  # TODO: Encrypt

    level: int = 1

    @property
    def creds(self):
        """Returns the Google Credentials object for the user"""
        data = json.loads(self.credentials)
        client_id = Secrets().get("GOOGLE_CLIENT_ID")
        client_secret = Secrets().get("GOOGLE_CLIENT_SECRET")
        data.update(dict(
            client_id=client_id,
            client_secret=client_secret
        ))
        return Credentials.from_authorized_user_info(data)
