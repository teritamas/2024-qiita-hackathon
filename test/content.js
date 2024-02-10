const settings = {
  async: true,
  crossDomain: true,
  url: "https://happy-world-api-ez5q3zuvrq-uc.a.run.app/make_happy",
  // url: "http://127.0.0.1:8000/make_happy",
  method: "POST",
  headers: {
    accept: "application/json",
    "Content-type": "application/json",
  },
};

/**
 * APIリクエストを送信し、ハッピーな文章に置き換える
 */
function requestMakeHappy(elements) {
  const messages = Array.from(elements).map((element) => element.textContent);
  $.ajax({
    ...settings,
    data: JSON.stringify({ input_messages: messages }),
  }).done(function (response) {
    const happyMessages = response.results;

    // 変更対象となるすべての要素に対して処理を行う
    elements.forEach((element) => {
      let currentValue = element.textContent;
      // happyMessagesの各要素のうち、input_messageが同じものを取得
      const happyMessage = happyMessages.find(
        (happyMessage) => happyMessage.input_message === currentValue
      );
      if (happyMessage) {
        // その要素のテキストをhappyMessageのoutput_messageに変更
        element.textContent = happyMessage.happy_message;
        // 元のメッセージを小さい文字で表示
        const originalMessage = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "元のメッセージを表示";
        originalMessage.textContent = currentValue;
        originalMessage.style.fontSize = "small";
        originalMessage.appendChild(summary);
        element.appendChild(originalMessage);
      }
    });
    return happyMessages;
  });
}

/**
 * Slackのメッセージを取得し、ハッピーな文章に置き換える
 */
function processMakeHappy() {
  // 変更があった場合に一致する全ての要素に対してリクエストを行う
  const elements = document.querySelectorAll(".p-rich_text_section");
  if (elements.length === 0) return;
  console.log("変更対象:", elements.length, "件");

  // それぞれの要素のテキストを取得
  const happyMessages = requestMakeHappy(elements);
}

addEventListener("load", function () {
  // 2秒待ってから処理を開始
  setTimeout(processMakeHappy, 2000);
});
