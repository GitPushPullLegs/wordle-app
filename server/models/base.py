import datetime
import json
from typing import Optional, get_type_hints

from pydantic import BaseModel
from google.cloud import bigquery


bigquery_client = bigquery.Client(project="wordle-386115")


class Base(BaseModel):
    __table__ = NotImplementedError()

    write_ts: Optional[datetime.datetime] = datetime.datetime.utcnow()

    def save(self):
        data = self.dict()
        for key, value in data.items():
            if type(value) == dict:
                data[key] = json.loads(value)

            # Always update the write_ts. The field is optional, so you don't have to set it when creating a new object.
            if key == "write_ts":
                data[key] = str(datetime.datetime.utcnow())
            elif type(value) == datetime.datetime:
                data[key] = value.strftime("%Y-%m-%d %H:%M:%S")
        errors = bigquery_client.insert_rows_json(
            f"wordle-386115.application_data.{self.__table__}",
            [data]
        )

        if not errors:
            print("Saved data")
        else:
            print("Failed to save")
            print(errors)

    @classmethod
    def _get_all(cls, **kwargs):
        # Query the table for the first row that matches the kwargs.
        # The kwargs are passed in as part of the where clause.
        hints = get_type_hints(cls)

        # Create a list of where statements, wrapping in quotes if the value is not a number and converting None's to
        # NULLs
        where_statements = []
        for key, value in kwargs.items():
            if hints.get(key) in [int, float]:
                where_statements.append(f"{key} = {value}")
            elif value is None:
                where_statements.append(f"{key} IS NULL")
            else:
                where_statements.append(f"{key} = \"{value}\"")

        return bigquery_client.query(
                f"SELECT * FROM `wordle-386115.application_data.{cls.__table__}` "
                f"WHERE {' AND '.join(where_statements)} ORDER BY write_ts DESC"
            ).result()

    @classmethod
    def get(cls, **kwargs):
        data = next(cls._get_all(**kwargs), None)

        if data:
            return cls(**data)

    @classmethod
    def get_all(cls, **kwargs):
        return [cls(**data) for data in cls._get_all(**kwargs)]
