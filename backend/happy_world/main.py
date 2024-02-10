from fastapi import FastAPI
from .models import make_happy_response
from .facades.chatgpt import chatGPT

app = FastAPI()


@app.post("/make_happy", response_model=make_happy_response.MakeHappyResponse)
def post_make_happy(input_message: str):
    happy_message: str = chatGPT.make_happy(input_message)
    return {
        "happy_message": happy_message,
        "input_message": input_message,
    }
