from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from happy_world.exceptions.convert_exception import ConvertException
from happy_world.models.make_happy_request import MakeHappyRequest
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
