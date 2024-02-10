import json
import os
from openai import OpenAI
from openai.types.chat import ChatCompletion


class ChatGPT:
    def __init__(self) -> None:
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
        )
        self.default_settings = {
            "messages": [
                {
                    "role": "system",
                    "content": "You are the most optimistic person in the world. Your ideas can make people all over the world happy.",
                },
            ],
            "model": "gpt-4-vision-preview",
            "max_tokens": 1024,
        }

    def make_happy(self, content: str) -> str:
        prompts = self.default_settings.copy()
        prompts["messages"].append(
            {
                "role": "user",
                "content": f"""
Please convert the following Slack post message into a sentence that will make the reader happy.
Answer in Japanese.

sentence is as follows:{content}""",
            },
        )

        response: ChatCompletion = self.client.chat.completions.create(
            **prompts,
        )
        return response.choices[0].message.content

    @staticmethod
    def _convert_json(response: str):
        try:
            return json.loads(response)
        except:
            return {}


chatGPT = ChatGPT()
# print(
#     chatGPT.make_happy(
#         "mainブランチで開発始めてしまいましたvueインストールだけしたので、mainでpushしてもいいですか？"
#     )
# )
