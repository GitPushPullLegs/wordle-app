import json

from server.models.base import Base


class Stats(Base):
    __table__ = "stats"

    user_id: str

    games_played: int = 0

    current_streak: int = 0
    longest_streak: int = 0

    distribution: str  # TODO: Use an actual json object

    @property
    def distribution_dict(self):
        return json.loads(self.distribution)
