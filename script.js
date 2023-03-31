fetch('text.txt')
  .then(response => response.text())
  .then(data => {
    const contentElement = document.getElementById('content');
    const paragraphs = data.split('\n').filter(line => line.trim() !== '');
    
    paragraphs.forEach(paragraph => {
      const pElement = document.createElement('p');
      pElement.textContent = paragraph;
      contentElement.appendChild(pElement);
    });
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
