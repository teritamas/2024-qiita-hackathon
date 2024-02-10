import json
import os
from re import M
from typing import List
from happy_world.models.make_happy_response import MakeHappyMessageItem
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
            "model": "gpt-4-turbo-preview",
            "max_tokens": 2048,
        }

    def make_happy(self, input_messages: List[str]) -> {}:
        prompts = self.default_settings.copy()
        prompts["messages"].append(
            {
                "role": "user",
                "content": f"""
Please remove the malicious language in the following Slack post message and convert it into text that will make the reader happy.
Do not change the meaning of the original input_message.

The source sentences are passed as a list. For each sentence, please return it in the following format:
{input_messages}
"""
                + """
A subject consists of a title and a description in the following format.
[{
  "input_message": "input value. never change.",
  "happy_message": "Converted message. About the same length as the input_message text."
},
{
  "input_message": "input value. never change.",
  "happy_message": "Converted message. About the same length as the input_message text."
},]

Value is natural Japanese as Japanese would return it.
Keys must be included.
Must be an array.
Remove any information other than JSON.
Delete code blocks.
""",
            },
        )

        response: ChatCompletion = self.client.chat.completions.create(
            **prompts,
        )
        print(response.choices[0].message.content)
        response_dict: List[dict] = self._convert_json(
            response.choices[0].message.content
        )
        try:
            return [MakeHappyMessageItem(**item) for item in response_dict]
        except Exception as e:
            print("Jsonの変換に失敗しました. ", e)
            print(response_dict)
            return []

    @staticmethod
    def _convert_json(response: str):
        try:
            return json.loads(response)
        except json.JSONDecodeError():
            return {}


chatGPT = ChatGPT()
# print(
#     chatGPT.make_happy(
#         [
#             "mainブランチで開発始めてしまいましたvueインストールだけしたので、mainでpushしてもいいですか？",
#             "馬鹿野郎、言い訳ないだろう",
#             "お前はもう死んでいる",
#         ],
#     )
# )
