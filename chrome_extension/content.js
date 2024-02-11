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
function requestMakeHappy(elements, positiveValueRatio) {
  // テキストのみ取得
  const messages = Array.from(elements).map((element) => {
    // (変換待機中...)を削除
    return element.textContent.replace(/\(変換待機中\.\.\.\)/g, "");
  });
  $.ajax({
    ...settings,
    data: JSON.stringify({
      input_messages: messages,
      positive_value_ratio: positiveValueRatio,
    }),
  })
    .done(function (response) {
      const happyMessages = response.results;
      const newElements = document.querySelectorAll(".p-rich_text_section");

      // 変更対象となるすべての要素に対して処理を行う
      newElements.forEach((newElement) => {
        // (変換待機中...)を削除
        let currentValue = newElement.textContent.replace(
          /\(変換待機中\.\.\.\)/g,
          ""
        );
        // happyMessagesの各要素のうち、input_messageが同じものを取得
        const happyMessage = happyMessages.find(
          (happyMessage) => happyMessage.input_message === currentValue
        );
        if (happyMessage) {
          // その要素のテキストをhappyMessageのoutput_messageに変更
          newElement.textContent = happyMessage.happy_message;
          newElement.classList.add("typing"); // "typing" クラスを追加
          setTimeout(function(){
            // 元のメッセージを小さい文字で表示
            const originalMessage = document.createElement("details");
            const summary = document.createElement("summary");
            summary.textContent = "元のメッセージを表示";

            originalMessage.textContent = currentValue;
            originalMessage.style.fontSize = "small";
            originalMessage.appendChild(summary);
            originalMessage.classList.add("typing"); // "typing" クラスを追加
            newElement.appendChild(originalMessage);
        },3000);

          // ポジティブ度をメッセージの横に小さく表示
          // const positiveValue = document.createElement("span");
          // positiveValue.textContent = `(ポジティブ度: ${positiveValueRatio})`;
          // positiveValue.style.fontSize = "small";
          // newElement.appendChild(positiveValue);
        }
      });
      return happyMessages;
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log("fail", jqXHR.status);
    })
    .always(() => hideLoader());
}

/**
 * チェックボタン
 * Slackのメッセージを取得し、ハッピーな文章に置き換える
 */
function processCheckHappy() {
    // 変更があった場合に一致する全ての要素に対してリクエストを行う
    const elements = document.querySelectorAll('.ql-editor > p');
    if (elements.length === 0) return;
    console.log("送信対象:", elements.length, "件");

    let input_text = "";
    // 各 p タグのテキスト値を出力
    elements.forEach(function(element) {
        input_text = element.textContent
        console.log(element.textContent);
    });

    return input_text;
}

/**
 * changeボタン
 * Slackのメッセージを取得し、ハッピーな文章に置き換える
 */
function processMakeHappy(positiveValueRatio) {
  // 変更があった場合に一致する全ての要素に対してリクエストを行う
  const elements = document.querySelectorAll(".p-rich_text_section");
  if (elements.length === 0) return;
  console.log("変更対象:", elements.length, "件");

  //　すべてのメッセージの末尾に「変換中」を追加
  elements.forEach((element) => {
    const converting = document.createElement("span");
    converting.textContent = "(変換待機中...)";
    converting.style.fontSize = "small";
    element.appendChild(converting);
  });

  // 2件ずつ5秒ごとにrequestMakeHappyリクエストを送信
  const chunkSize = 2;
  for (let i = 0; i < elements.length; i += chunkSize) {
    // slice以外でchunk作成
    const chunk = Array.from(elements).slice(i, i + chunkSize);
    setTimeout(() => {
      requestMakeHappy(chunk, positiveValueRatio);
      const messages = Array.from(chunk).map((element) => {
        return element.textContent;
    });
      console.debug("requestMakeHappy", messages);
      // デバッグ用
    }, i * 5000);
  }
}

/**
 * popup.htmlのボタンが押されたときの処理
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    /**
     * changeボタンが押されたら
     * Slackのメッセージを取得し、ハッピーな文章に置き換える
     */
  if (message.action === "changeFunction") {
    // 数字に変換
    const positiveValueRatio = parseFloat(message.positiveValueRatio);
    // ここに実行したい関数を記述します
    processMakeHappy(positiveValueRatio);
    showLoader();
    setTypingStyles();
  }

    /**
     * checkボタンが押されたら
     * Slackのメッセージを取得し、ハッピーな文章に置き換える
     */
  if (message.action === "checkFunction") {
    // 数字に変換
    const positiveValueRatio = parseFloat(message.positiveValueRatio);
    // ここに実行したい関数を記述します
    const input_message = processCheckHappy(positiveValueRatio);
    const happyMessages = '';
    sendResponse({
        'input_message': input_message,
        }
    );
    setTimeout(() => {
        $.ajax({
            ...settings,
            data: JSON.stringify({
              input_messages: [input_message],
              positive_value_ratio: positiveValueRatio,
            }),
          })
            .done(function (response) {
                chrome.runtime.sendMessage({ message: "from_contents", 'happyMessages': response.results[0].happy_message,}, function (res) {
                    console.log("送信");
                  });
            })
            .fail((jqXHR, textStatus, errorThrown) => {
              console.log("fail", jqXHR.status);
              chrome.runtime.sendMessage({ message: "from_contents", 'happyMessages': '失敗しちゃった😢'}, function (res) {
                console.log("送信");
              });
            })
      }, 10000);
}});


// Function to show loader
function showLoader() {
  document.querySelector(".loader-box").style.display = "block";
}

// Function to hide loader
function hideLoader() {
  document.querySelector(".loader-box").style.display = "none";
}

// 初回読み込み時にローディング画面を設定
addEventListener("load", function () {
  setLoader();
});


function setTypingStyles() {
    // CSSスタイルを定義する文字列
    var cssStyles = `
    .typing {
    width: 100%; /* 文字数分の長さに設定 */
    animation: typing 2s steps(16);
    white-space: nowrap; /* 必須 */
    overflow: hidden; /* 必須 */
    }

    @keyframes typing {
    from {
        width: 0; /* 行頭から開始 */
    }
    }
    `;

    // style要素を作成し、CSSスタイルを設定
    var styleElement = document.createElement("style");
    styleElement.textContent = cssStyles;

    // body要素にstyle要素を追加
    document.body.appendChild(styleElement);
}
function setLoader() {
  var style = document.createElement("style");
  style.innerHTML = `
        /* CSS styles */
        .loader-box {
            display: none; /* Initially hidden */
            position: fixed;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: #bcceff63;
            z-index: 100;
        }

        .loader {
            width: 60px;
            height: 60px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            z-index: 100;
        }

        .loader div {
            width: 20px;
            height: 20px;
            float: left;
            display: flex;
            justify-content: center;
            align-content:  center;
            align-items: center;
            position: relative;
        }
        
        .load-span {
            position: absolute;
            display: block;
            border-radius: 3px;
            animation: anim 1.2s infinite;
            animation-timing-function: linear;
            z-index: 103;
        }
        
        @keyframes anim {
            0% { width:0px; height:0px; background: #18FFFF }
            40% { width:15px; height:15px; background: #D500F9 }
            80% { width:0px; height:0px; background: #18FFFF }
        }
        
        .loader div:nth-child(2) .load-span,
        .loader div:nth-child(4) .load-span {
            animation-delay: 0.15s;
        }
        
        .loader div:nth-child(3) .load-span,
        .loader div:nth-child(5) .load-span,
        .loader div:nth-child(7) .load-span {
            animation-delay: 0.30s;
        }
        
        .loader div:nth-child(6) .load-span,
        .loader div:nth-child(8) .load-span {
            animation-delay: 0.45s;
        }
        
        .loader div:nth-child(9) .load-span {
            animation-delay: 0.60s;
        }
    `;

  // Append style element to head
  document.head.appendChild(style);

  // Create loader elements
  var loaderBox = document.createElement("div");
  loaderBox.classList.add("loader-box");

  var loader = document.createElement("div");
  loader.classList.add("loader");

  for (var i = 0; i < 9; i++) {
    var div = document.createElement("div");
    var span = document.createElement("span");
    span.classList.add("load-span");
    div.appendChild(span);
    loader.appendChild(div);
  }

  loaderBox.appendChild(loader);
  document.body.appendChild(loaderBox);
}
