from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from happy_world.models.make_happy_request import MakeHappyRequest
from .models.make_happy_response import MakeHappyMessageItem, MakeHappyResponse
from .facades.chatgpt import chatGPT

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
    happy_messages: List[MakeHappyMessageItem] = chatGPT.make_happy(
        make_request.input_messages
    )
    print(happy_messages)
    return MakeHappyResponse(results=happy_messages)
