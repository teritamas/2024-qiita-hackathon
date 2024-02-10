from typing import List
from pydantic import BaseModel, Field


class MakeHappyRequest(BaseModel):
    input_messages: List[str] = Field(
        ..., description="変換したいメッセージのリスト."
    )
