from typing import List
from pydantic import BaseModel, Field


class MakeHappyRequest(BaseModel):
    input_messages: List[str] = Field(
        ..., description="変換したいメッセージのリスト."
    )
    positive_value_ratio: int = Field(
        50,
        description="文章をどれだけポジティブにするかの割合. 0-100の間で指定.",
    )
