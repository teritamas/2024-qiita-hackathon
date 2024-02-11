from pydantic import BaseModel, Field


class ScoringRequest(BaseModel):
    input_message: str = Field(..., description="検証するメッセージ.")
