from datetime import datetime
from typing import Optional

from server.models.base import Base


class Game(Base):
    __table__ = "game"

    game_id: str  # Unique identifier for the game

    user_id: str  # The user who created the game

    word: str  # The word the user is trying to guess

    created_at: datetime = datetime.utcnow()
    finished_at: Optional[datetime]

    solved_row: Optional[int]  # The row the user got correct, if null, the user didn't win.


class Guess(Base):
    __table__ = "guess"

    guess_id: str  # Unique identifier for the guess
    game_id: str  # The game the guess is for
    guess: str  # The guess itself
    correct: bool  # Whether the guess was correct
