function splitTextIntoChunks(text, maxWords) {
  const words = text.split(/\s+/);
  const chunks = [];

  let currentChunk = [];
  let currentWordCount = 0;

  words.forEach(word => {
    const sentenceEnd = word.match(/[.!?]/);

    currentChunk.push(word);
    currentWordCount++;

    if (sentenceEnd || currentWordCount >= maxWords) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
      currentWordCount = 0;
    }
  });

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}

fetch('text.txt')
  .then(response => response.text())
  .then(data => {
    const contentElement = document.getElementById('content');
    const textChunks = splitTextIntoChunks(data, 200);
    
    if (orderNumber < textChunks.length) {
      const pElement = document.createElement('p');
      pElement.textContent = textChunks[orderNumber];
      contentElement.appendChild(pElement);
    } else {
      console.error('Order number is out of range');
    }
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
