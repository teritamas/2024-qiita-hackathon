const settings = {
  async: true,
  crossDomain: true,
  url: "https://happy-world-api-ez5q3zuvrq-uc.a.run.app/make_happy",
  method: "POST",
  headers: {
    accept: "application/json",
    "Content-type": "application/json",
  },
};

// 初期設定
const config = { childList: true, subtree: true };

/**
 * Slackのメッセージを取得し、ハッピーな文章に置き換える
 */
function processMakeHappy() {
  // 変更があった場合に一致する全ての要素に対してリクエストを行う
  const elements = document.querySelectorAll(".p-rich_text_section");
  if (elements.length === 0) return;
  console.log("変更対象:", elements.length, "件");

  // それぞれの要素のテキストを取得
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
      console.log(happyMessage);
      if (happyMessage) {
        // その要素のテキストをhappyMessageのoutput_messageに変更
        element.textContent = happyMessage.happy_message;
      }
    });
  });
}

addEventListener("load", function () {
  processMakeHappy();
});
