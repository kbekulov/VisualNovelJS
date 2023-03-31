const WORDS_PER_CHUNK = 200;
let order = 1;

function getQueryParam(name, defaultValue) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || defaultValue;
}

document.addEventListener('click', () => {
  order = (order % chunks.length) + 1;
  const content = chunks[order - 1];
  contentElement.textContent = content;
});

document.addEventListener('keydown', event => {
  if (event.code === 'Space') {
    order = (order % chunks.length) + 1;
    const content = chunks[order - 1];
    contentElement.textContent = content;
  }
});

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

    order = parseInt(getQueryParam('order', 1));
    const content = chunks[order - 1];
    contentElement.textContent = content;
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
