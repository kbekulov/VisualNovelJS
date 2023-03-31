async function fetchTextFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch the text file');
  }
  return response.text();
}

function splitText(text, maxWords) {
  const words = text.split(/\s+/);
  const result = [];
  let currentChunk = [];

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i]);

    if (currentChunk.length >= maxWords || i === words.length - 1) {
      let lastIndex = currentChunk.length - 1;

      if (i !== words.length - 1) {
        while (!currentChunk[lastIndex].endsWith('.') && !currentChunk[lastIndex].endsWith('!') && !currentChunk[lastIndex].endsWith('?') && lastIndex > 0) {
          lastIndex--;
        }
      }

      const chunkText = currentChunk.slice(0, lastIndex + 1).join(' ');
      result.push(chunkText);

      currentChunk = currentChunk.slice(lastIndex + 1);
    }
  }

  return result;
}

async function init() {
  try {
    const text = await fetchTextFile('text.txt');
    const splittedTextArray = splitText(text, 200);

    // Example: display the array item of your choice
    const arrayIndex = 0; // Change this to the desired index
    const outputElement = document.getElementById('output');
    outputElement.textContent = splittedTextArray[arrayIndex];
  } catch (error) {
    console.error(error);
  }
}

init();
