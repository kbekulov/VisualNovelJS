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
    textChunks = splitTextIntoChunks(data, 200);
    updateContent();
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
