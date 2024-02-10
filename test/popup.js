document.getElementById('myButton').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'executeFunction'});
    });
});

var input = document.getElementById('input-range');

input.addEventListener('input', function () {
  getRangeValue(input);
});

input.addEventListener('change', function () {
  getRangeValue(input); /* for IE */
});

function getRangeValue(e) {
  var value = e.value;
  document.querySelector('.value').textContent = value;
  document.querySelector('.range').setAttribute('data-value', value);
  input.setAttribute('value', value);
}