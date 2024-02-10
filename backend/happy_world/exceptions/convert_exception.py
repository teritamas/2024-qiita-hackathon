class ConvertException(Exception):
    def __init__(
        self,
        error_message="メッセージの変換に失敗しました",
        e=None,
        gpt_response=None,
    ):
        self.error_message = error_message
        self.e = e
        self.gpt_response = gpt_response

    def __str__(self):
        return f"Error: {self.error_message}, Exception: {self.e}, GPT Response: {self.gpt_response}"
