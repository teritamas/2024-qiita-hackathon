window.addEventListener('load', function() {
    const elements = document.querySelectorAll('.p-rich_text_section');
    console.log(elements);
    elements.forEach(element => {
      console.log(element);
      element.textContent = 'HAPPY';
    });
});