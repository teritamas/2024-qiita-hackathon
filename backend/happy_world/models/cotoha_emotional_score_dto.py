from pydantic import BaseModel, Field


class CotohaEmotionalScoreDto(BaseModel):
    emotional_score: float = Field(..., description="感情スコア.")
    input_message: str = Field(..., description="元のメッセージ.")
