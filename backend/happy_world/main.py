from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from happy_world.exceptions.convert_exception import ConvertException
from happy_world.models.cotoha_emotional_score_dto import (
    CotohaEmotionalScoreDto,
)
from happy_world.models.make_happy_request import MakeHappyRequest
from happy_world.models.scoring_request import ScoringRequest
from happy_world.models.scoring_response import ScoringResponse
from .models.make_happy_response import MakeHappyMessageItem, MakeHappyResponse
from .facades.chatgpt import chatGPT
from .facades.cotoha import cotoha

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/make_happy", response_model=MakeHappyResponse)
def post_make_happy(make_request: MakeHappyRequest):
    """文章をポジティブな文章に変換する。
    """
    try:
        # 感情分析
        input_message_with_emotional_scores = [
            cotoha.predict(input_message)
            for input_message in make_request.input_messages
        ]

        print(input_message_with_emotional_scores)
        # 感情分析結果を元に、幸せなメッセージを生成
        happy_messages: List[MakeHappyMessageItem] = chatGPT.make_happy(
            input_message_with_emotional_scores,
            make_request.positive_value_ratio,
        )
        return MakeHappyResponse(results=happy_messages)
    except ConvertException as e:
        print(e)
        return MakeHappyResponse(results=[])


@app.post("/scoring", response_model=ScoringResponse)
def post_scoring(scoring_request: ScoringRequest):
    """文章の感情スコアを取得する。0-1の範囲でポジティブな値が高いほど1に近い。
    """
    try:
        # 感情分析
        dto: CotohaEmotionalScoreDto = cotoha.predict(
            scoring_request.input_message
        )
        return ScoringResponse(
            **dto.model_dump(),
        )
    except ConvertException as e:
        print(e)
