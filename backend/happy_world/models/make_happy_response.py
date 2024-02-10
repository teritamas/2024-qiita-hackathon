from pydantic import BaseModel, Field


class MakeHappyResponse(BaseModel):
    happy_message: str = Field(
        ..., description="幸せな文面に変換されたメッセージ."
    )
    input_message: str = Field(..., description="元のメッセージ.")
