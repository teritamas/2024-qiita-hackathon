from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from happy_world.models.make_happy_request import MakeHappyRequest
from .models import make_happy_response
from .facades.chatgpt import chatGPT

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/make_happy", response_model=make_happy_response.MakeHappyResponse)
def post_make_happy(make_request: MakeHappyRequest):
    happy_message: str = chatGPT.make_happy(make_request.input_message)
    return {
        "happy_message": happy_message,
        "input_message": make_request.input_message,
    }
