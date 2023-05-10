from os import environ
import base64
from googleapiclient.discovery import build
from google.oauth2 import credentials

import threading
lock = threading.Lock()


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            with lock:
                if cls not in cls._instances:
                    cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class Secrets(metaclass=Singleton):
    def __init__(self):
        self._service = None
        self.project = environ["GCP_PROJECT"]
        self.__data = {}

    @property
    def service(self):
        if not self._service:
            creds = credentials.Credentials(token=environ.get("GCP_TOKEN")) if environ.get("GCP_TOKEN") else None
            self._service = build("secretmanager", "v1", credentials=creds)  # Detect credentials from environment
        return self._service

    def get(self, key):
        if key in self.__data:
            value = self.__data.get(key)
        elif environ.get(key):
            value = environ[key]
        else:
            value = self._fetch(key)

        self.__data[key] = value
        return value

    def _fetch(self, key):
        secret_name = f"projects/{self.project}/secrets/{key}/versions/latest"
        p = self.service.projects().secrets().versions().access(name=secret_name)
        data = p.execute()
        return base64.b64decode(data["payload"]["data"]).decode("utf-8")