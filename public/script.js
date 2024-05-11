let resultsList = {};

const submitButton = document.getElementById("submittor");
const search = document.getElementById("search");
const resultsContainer = document.getElementById("resultsContainer");

function createResultElement(content) {
  const elementName = document.createElement("p");
  elementName.textContent = content;
  elementName.classList.add("result");
  elementName.addEventListener("click", () => {
    navigator.clipboard.writeText(content);
  });
  resultsContainer.appendChild(elementName);
}

submitButton.addEventListener("submit", async (e) => {
  e.preventDefault();

  const response = await fetch(`/api/get-input/?movieName=${search.value}`);
  const data = await response.json();
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.lastChild);
  }
  if (data.results.length === 0) {
    createResultElement("nuthin");
    return;
  }

  let dirName = "Anonymous";

  for (let i = 0; i < Math.min(3, data.results.length); i++) {
    const creditResponse = await fetch(
      `/api/get-credits/?movieId=${data.results[i].id}`
    );
    const creditsData = await creditResponse.json();
    creditsData?.crew.forEach((element) => {
      if (element.job === "Director") {
        dirName = element.name;
      }
    });
    const date = data.results[i].release_date
      ? ` (${data.results[i].release_date.slice(0, 4)})`
      : "";
    createResultElement(`${data.results[i].title}${date}, dir. ${dirName}`);
  }
});
