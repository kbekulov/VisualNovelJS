fetch('text.txt')
  .then(response => response.text())
  .then(data => {
    document.getElementById('content').innerHTML = data;
  })
  .catch(error => {
    console.error('Error fetching text:', error);
  });
