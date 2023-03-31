document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("text.txt");
  const text = await response.text();
  const paragraphs = text.split("\n\n").filter(p => p.trim() !== "");
  let container = document.getElementById("text-container");

  document.getElementById("background-image").style.opacity = "1";

  const typeWriter = async (text, index = 0) => {
      if (index < text.length) {
          container.innerHTML += text.charAt(index);
          setTimeout(() => typeWriter(text, index + 1), 50);
      }
  };

  const displayParagraph = async (paragraph, index = 0) => {
      if (index < paragraphs.length) {
          const p = document.createElement("p");
          container.appendChild(p);
          container = p;

          const clickOrSpace = async () => {
            return new Promise(resolve => {
                const listener = event => {
                    if (event.type === "click" || event.key === " ") {
                        document.removeEventListener("click", listener);
                        document.removeEventListener("keydown", listener);
                        resolve();
                    }
                };
                document.addEventListener("click", listener);
                document.addEventListener("keydown", listener);
            });
        };

        await typeWriter(paragraph);

        while (container.innerHTML !== paragraph) {
            await clickOrSpace();
            container.innerHTML = paragraph;
        }

        container.style.opacity = "0.5";
        displayParagraph(paragraphs[index + 1], index + 1);
    }
};

displayParagraph(paragraphs[0]);

const reviewLink = document.getElementById("review-link");
const reviewBox = document.getElementById("review-box");

reviewLink.addEventListener("click", event => {
    event.preventDefault();
    reviewBox.innerHTML = "";
    paragraphs.forEach(paragraph => {
        const p = document.createElement("p");
        p.innerHTML = paragraph;
        reviewBox.appendChild(p);
    });
    reviewBox.style.display = "block";
});

reviewBox.addEventListener("click", () => {
    reviewBox.style.display = "none";
});
});

