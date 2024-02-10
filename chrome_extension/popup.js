document.getElementById("myButton").addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "executeFunction",
      positiveValueRatio: document.querySelector(".positive-value-ratio")
        .textContent,
    });
  });
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
