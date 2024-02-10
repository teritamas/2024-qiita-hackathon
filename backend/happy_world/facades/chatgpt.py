import json
from json import JSONDecodeError
import os
import re
from typing import List
from happy_world.exceptions.convert_exception import ConvertException
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
                    # とてもポジティブな人間になってもらう
                    "role": "system",
                    "content": "You are the most optimistic person in the world. Your ideas can make people all over the world happy.",
                },
            ],
            "model": "gpt-4-turbo-preview",
            "max_tokens": 4096,
        }

    def make_happy(
        self, input_messages: List[str], positive_value_ratio: int
    ) -> List[MakeHappyMessageItem]:
        prompts = self.default_settings.copy()
        prompts["messages"].append(
            {
                "role": "user",
                "content": f"""Please convert the following Slack post message to the following
- If the maximum positivity is 100, convert the message to be positive by {positive_value_ratio}.
- Remove malicious language.
- Meet Humility, Respect, and Trust

Input is stored as an array.
{input_messages}"""
                + """
Each element of this one should be converted according to the following format
A subject consists of a input_message and a happy_message in the following format.
[{
  "input_message": "input_message. never change.",
  "happy_message": "Converted message. About the same length as the input_message text."
},]
Delete code blocks.
Delete information other than JSON.
Value is natural Japanese as Japanese would return it.
Keys must be included.
Must be an array.
""",
            },
        )
        try:
            response: ChatCompletion = self.client.chat.completions.create(
                **prompts,
            )

            content = response.choices[0].message.content
            print(f"レスポンス: {content}")
            # ```json から始まるコードブロックの削除。どうしても稀に稀にコードブロックが混じるため
            content = re.sub(r"```json", "", content)
            content = re.sub(r"```", "", content)
            print(f"変換後: {content}")
            # jsonに変換
            response_dict: List[dict] = self._convert_json(content)
            return [MakeHappyMessageItem(**item) for item in response_dict]
        except JSONDecodeError as e:
            raise ConvertException(
                error_message="Jsonの変換に失敗しました",
                e=e,
                gpt_response=content,
            )
        except Exception as e:
            raise ConvertException(
                error_message="その他の原因で失敗しました",
                e=e,
                gpt_response=content,
            )

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
#             "馬鹿野郎、言いわけないだろう",
#             "お前はもう死んでいる",
#         ],
#     )
# )
