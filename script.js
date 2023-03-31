function updateDisplayedText() {
  if (orderNumber < textChunks.length) {
    const contentElement = document.getElementById('content');
    contentElement.innerHTML = '';

    const pElement = document.createElement('p');
    pElement.textContent = textChunks[orderNumber];
    contentElement.appendChild(pElement);
  } else {
    console.error('Order number is out of range');
  }
}

fetch('text.txt')
  .then(response => response.text())
  .then(data => {
    textChunks = splitTextIntoChunks(data, 200);
    updateDisplayedText();
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
