from pydantic import BaseModel, Field


class MakeHappyRequest(BaseModel):
    input_message: str = Field(..., description="変換したいメッセージ.")
