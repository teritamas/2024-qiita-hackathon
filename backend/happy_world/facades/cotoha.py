import collections
import itertools
import os
from dotenv import load_dotenv
from happy_world.models.cotoha_emotional_score_dto import (
    CotohaEmotionalScoreDto,
)

import requests


class Cotoha:
    def __init__(self, client_id: str, client_secret: str):
        self.base_url = "https://api.ce-cotoha.com/api/dev/"
        self.is_active = False
        try:
            self.access_token = self._create_access_token(
                client_id, client_secret
            )
            self.is_active = True
        except Exception as e:
            print(e)

    def _create_access_token(self, client_id: str, client_secret: str) -> str:
        """CotohaAPIを利用するためのアクセストークンを取得する。
        Args:
            client_id (str): [description]
            client_secret (str): [description]
        Returns:
            str: [description]
        """
        headers = {
            "Content-Type": "application/json;charset=UTF-8",
        }
        body = {
            "grantType": "client_credentials",
            "clientId": client_id,
            "clientSecret": client_secret,
        }
        response = requests.post(
            "https://api.ce-cotoha.com/v1/oauth/accesstokens",
            headers=headers,
            json=body,
        )
        return response.json()["access_token"]

    def predict(self, input_message: str) -> CotohaEmotionalScoreDto:
        """Cotohaの感情分析APIを利用する。
        https://api.ce-cotoha.com/contents/reference/apireference.html#similarity
        Args:
            target_sentence (str): The sentence to be identified
        Returns:
            str: Json string containing the identification results
        """

        headers = {
            "Content-Type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + self.access_token,
        }
        body = {"sentence": input_message}

        endpoint = os.path.join(self.base_url, "nlp/v1/sentiment")
        cotoha_response = requests.post(endpoint, headers=headers, json=body)
        if cotoha_response.json()["result"]["emotional_phrase"] != []:
            tmp_cotoha_response_array = [
                x["emotion"].split(",")
                for x in cotoha_response.json()["result"]["emotional_phrase"]
            ]
            cotoha_response_array = list(
                itertools.chain.from_iterable(tmp_cotoha_response_array)
            )
            emotional_sentiment = self._get_max_emotion(cotoha_response_array)
        else:
            emotional_sentiment = cotoha_response.json()["result"]["sentiment"]
        response = cotoha_response.json()
        response["result"]["emotional_sentiment"] = emotional_sentiment
        if response["result"]["emotional_sentiment"] == "Neutral":
            # ニュートラルな文章であると判断された時のスコア、0.25~0.75の範囲でスコアを与える
            score = 0.5 + (0.5 - (response["result"]["score"]) / 2)
        elif response["result"]["emotional_sentiment"] == "Positive":
            # ポジティブな文章であると判断された時のスコア、0.75~1.0の範囲でスコアを与える
            score = 0.75 + (response["result"]["score"] / 4)
        else:
            # ネガティブな文章であると判断された時のスコア、0.0~0.25の範囲でスコアを与える
            score = response["result"]["score"] / 4

        return CotohaEmotionalScoreDto(
            input_message=input_message, emotional_score=score
        )

    def _get_max_emotion(self, emotion_list: list) -> str:
        counter = collections.Counter(emotion_list)
        emotion_value = counter.most_common()[0][0]
        if emotion_value == "P":
            return "Positive"
        elif emotion_value == "PN":
            return "Neutral"
        elif emotion_value == "N":
            return "Negative"
        else:
            return emotion_value


load_dotenv()
COTOHA_CLIENT_ID = os.getenv("COTOHA_CLIENT_ID", default="")
COTOHA_CLIENT_SECRET = os.getenv("COTOHA_CLIENT_SECRET", default="")

cotoha = Cotoha(COTOHA_CLIENT_ID, COTOHA_CLIENT_SECRET)

if __name__ == "__main__":
    print(
        cotoha.predict(
            "どういうことをしたら登録できなくなったのか教えてください。その文章だけでは何をアドバイスしたらいいかわかりません。"
        )
    )
