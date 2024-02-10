const settings = {
  async: true,
  crossDomain: true,
  // url: "https://happy-world-api-ez5q3zuvrq-uc.a.run.app/make_happy",
  url: "http://127.0.0.1:8000/make_happy",
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
    data: JSON.stringify({
      input_messages: messages,
    }),
  })
    .done(function (response) {
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
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log("fail", jqXHR.status);
    })
    .always(() => hideLoader());
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

/**
 * ボタンが押されたら
 * Slackのメッセージを取得し、ハッピーな文章に置き換える
 */
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "executeFunction") {
    // ここに実行したい関数を記述します
    processMakeHappy();
    showLoader();
  }
});

// Function to show loader
function showLoader() {
  document.querySelector(".loader-box").style.display = "block";
}

// Function to hide loader
function hideLoader() {
  document.querySelector(".loader-box").style.display = "none";
}

function setLoading() {
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
