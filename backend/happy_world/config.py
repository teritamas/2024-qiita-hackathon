from os import environ
from dotenv import load_dotenv

load_dotenv(verbose=True)


# OpenAIのAPIキー
OPENAI_API_KEY = environ.get("OPENAI_API_KEY", "")
