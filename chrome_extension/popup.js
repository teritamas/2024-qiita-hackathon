document.getElementById("changeButton").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "changeFunction",
      positiveValueRatio: document.querySelector(".positive-value-ratio")
        .textContent,
    });
  });
});

document.getElementById("checkButton").addEventListener("click", function () {

    const checkButtonInputBox = document.getElementById("checkButtonInputBox");
    const happyMessagesInput = document.getElementById("happyButtonInputBox");

    // input要素が非表示の場合、表示に変更し、値が空の場合にローディングCSSを適用
    if (checkButtonInputBox.style.display === "none") {
        checkButtonInputBox.style.display = "block";
    }
    if (happyMessagesInput.style.display === "none") {
        happyMessagesInput.style.display = "block";
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: "checkFunction",
            positiveValueRatio: document.querySelector(".positive-value-ratio").textContent
        }, function(responseFromContent) {
            console.log(responseFromContent)
            // コンテンツから受け取ったレスポンスをダイアログ表示
            // inputMessageというIDを持つinput要素を取得
            const inputElement = document.getElementById("inputMessage");

            // input要素にテキストを追加
            inputElement.value = responseFromContent.input_message;
            // ポップアップを閉じる(コンテンツではない)
            //window.close();
        });
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "from_contents") {
        // inputを消す
        const happyMessagesInput = document.getElementById("happyMessagesInput");
        // 要素が存在する場合にのみ削除する
        if (happyMessagesInput) {
            happyMessagesInput.remove();
        }

         // happyMessagesというIDを持つテキストエリア要素を取得
        const happyMessagesTextarea = document.getElementById("happyMessages");
        happyMessagesTextarea.style.display = "block";
         // input要素にテキストを追加
         happyMessagesTextarea.value = request.happyMessages;
  }
  });
var input = document.getElementById("input-range");

input.addEventListener("input", function () {
  getRangeValue(input);
});

input.addEventListener("change", function () {
  getRangeValue(input); /* for IE */
});

function getRangeValue(e) {
  var positiveValueRatio = e.value;
  document.querySelector(".positive-value-ratio").textContent =
    positiveValueRatio;
  document
    .querySelector(".range")
    .setAttribute("data-value", positiveValueRatio);
  input.setAttribute("value", positiveValueRatio);
}
