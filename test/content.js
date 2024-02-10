function textConvertToHappy() {
    const elements = document.querySelectorAll('.p-rich_text_section');
    elements.forEach(element => {
      element.textContent = 'HAPPY';
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'executeFunction') {
      // ここに実行したい関数を記述します
      textConvertToHappy();
    }
  });
  