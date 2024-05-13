let resultsList = {};

const submitButton = document.getElementById("submittor");
const search = document.getElementById("search");
const resultsContainer = document.getElementById("resultsContainer");

const root = document.querySelector(":root");

const instructions = document.getElementById("instructions");

const choiceTv = document.getElementById("choiceTv");
choiceTv.addEventListener("click", () => {
  if (choiceTv.checked) {
    root.style.setProperty("--accent", "var(--pink-300)");
    instructions.textContent = "TV series";
  }
});

const choiceMovie = document.getElementById("choiceMovie");
choiceMovie.addEventListener("click", () => {
  if (choiceMovie.checked) {
    root.style.setProperty("--accent", "var(--violet-300)");
    instructions.textContent = "film";
  }
});

function createResultElement(content) {
  const elementName = document.createElement("p");
  elementName.textContent = content;
  elementName.classList.add("result");
  elementName.setAttribute("title", "Click to copy text to clipboard.");
  elementName.addEventListener("click", () => {
    navigator.clipboard.writeText(content);
  });
  resultsContainer.appendChild(elementName);
}

submitButton.addEventListener("submit", async (e) => {
  e.preventDefault();

  let choice = "movie";
  if (choiceTv.checked) {
    choice = "tv";
  }

  const response = await fetch(
    `/api/get-input/?choice=${choice}&name=${search.value}`
  );
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
      `/api/get-credits/?choice=${choice}&id=${data.results[i].id}`
    );
    const creditsData = await creditResponse.json();
    if (choice === "movie") {
      creditsData?.crew.forEach((element) => {
        if (element.job === "Director") {
          dirName = element.name;
        }
      });
      const date = data.results[i].release_date
        ? ` (${data.results[i].release_date.slice(0, 4)})`
        : "";
      createResultElement(`${data.results[i].title}${date}, dir. ${dirName}.`);
    } else {
      dirName = creditsData?.created_by[0].name;

      const first_air_date = creditsData.first_air_date;
      const last_air_date = creditsData.last_air_date;

      const date = `${first_air_date.slice(0, 4)}-${last_air_date.slice(0, 4)}`;
      createResultElement(
        `${data.results[i].name} (${date}), created by ${dirName}.`
      );
    }
  }
});
