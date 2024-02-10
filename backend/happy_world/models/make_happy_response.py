from typing import List
from pydantic import BaseModel, Field


class MakeHappyMessageItem(BaseModel):
    happy_message: str = Field(
        ..., description="幸せな文面に変換されたメッセージ."
    )
    input_message: str = Field(..., description="元のメッセージ.")


class MakeHappyResponse(BaseModel):
    results: List[MakeHappyMessageItem] = Field(
        [], description="幸せな文面に変換されたメッセージのリスト."
    )
