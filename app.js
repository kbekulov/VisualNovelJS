const container = document.getElementById("container");
const messageBox = document.getElementById("message-box");
const reviewLink = document.getElementById("review");

async function fetchText() {
    const response = await fetch("text.txt");
    const text = await response.text();
    return text;
}

function parseParagraphs(text) {
    return text.split("\n\n").filter(p => p.trim() !== "");
}

function typeText(element, text, index = 0) {
    return new Promise(resolve => {
        if (index < text.length) {
            element.textContent += text[index];
            setTimeout(() => {
                typeText(element, text, index + 1).then(resolve);
            }, 75);
        } else {
            resolve();
        }
    });
}

async function displayParagraphs(paragraphs) {
    for (const paragraph of paragraphs) {
        const p = document.createElement("p");
        container.appendChild(p);
        await typeText(p, paragraph);
        p.style.opacity = 0.5;

        const onClickOrSpace = e => {
            if (!e || e.type === "click" || (e.type === "keydown" && e.code === "Space")) {
                document.removeEventListener("click", onClickOrSpace);
                document.removeEventListener("keydown", onClickOrSpace);
                displayParagraphs(paragraphs.slice(1));
            }
        };

        document.addEventListener("click", onClickOrSpace);
        document.addEventListener("keydown", onClickOrSpace);
        break;
    }
}

fetchText()
    .then(parseParagraphs)
    .then(displayParagraphs);

    reviewLink.addEventListener("click", e => {
      e.preventDefault();
      messageBox.style.display = "block";
      messageBox.innerHTML = "";
      for (const p of container.querySelectorAll("p")) {
          const newP = document.createElement("p");
          newP.textContent = p.textContent;
          newP.style.opacity = 1;
          messageBox.appendChild(newP);
      }
  });
  
  messageBox.addEventListener("click", () => {
      messageBox.style.display = "none";
  });
  
  // Background image fade-in effect
  document.body.style.transition = "opacity 3s";
  document.body.style.opacity = 0;
  window.addEventListener("load", () => {
      setTimeout(() => {
          document.body.style.opacity = 1;
      }, 100);
  });
  
  // Black vignette on top of the background image
  const vignette = document.createElement("div");
  vignette.style.position = "fixed";
  vignette.style.top = "0";
  vignette.style.left = "0";
  vignette.style.right = "0";
  vignette.style.bottom = "0";
  vignette.style.backgroundImage =
      "radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)";
  document.body.appendChild(vignette);
  
