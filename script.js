const WORDS_PER_CHUNK = 200;

function getQueryParam(name, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || defaultValue;
}

fetch('text.txt')
  .then(response => response.text())
  .then(data => {
    const contentElement = document.getElementById('content');
    const sentences = data.match(/[^.!?]+[.!?]+/g).map(sentence => sentence.trim());
    const chunks = [];
    let currentChunk = '';

    sentences.forEach(sentence => {
      if ((currentChunk + ' ' + sentence).split(' ').length <= WORDS_PER_CHUNK) {
        currentChunk += ' ' + sentence;
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    });

    if (currentChunk !== '') {
      chunks.push(currentChunk.trim());
    }

    const order = getQueryParam('order', 1);
    const content = chunks[(order - 1) % chunks.length];
    contentElement.textContent = content;
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
