from fastapi import FastAPI
from happy_world.models.make_happy_request import MakeHappyRequest
from .models import make_happy_response
from .facades.chatgpt import chatGPT

app = FastAPI()


@app.post("/make_happy", response_model=make_happy_response.MakeHappyResponse)
def post_make_happy(make_request: MakeHappyRequest):
    happy_message: str = chatGPT.make_happy(make_request.input_message)
    return {
        "happy_message": happy_message,
        "input_message": make_request.input_message,
    }
