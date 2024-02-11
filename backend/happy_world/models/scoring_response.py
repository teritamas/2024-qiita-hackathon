from pydantic import BaseModel, Field


class ScoringResponse(BaseModel):
    input_message: str = Field(..., description="元のメッセージ.")
    emotional_score: float = Field(..., description="感情スコア.(0~1)")
