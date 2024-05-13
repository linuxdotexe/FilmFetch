const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.auth_token}`,
  },
};
export default function GET(request, response) {
  const baseURL = "https://api.themoviedb.org/3/search/";
  const name = request.query.name;
  const choice = request.query.choice;
  let search = ``;
  // TODO: look into this later
  // NOTE: fetch causing trouble at will.
  if (choice === "movie") {
    search += `movie?query=${name}`;
  } else {
    search += `tv?query=${name}`;
  }
  const url = baseURL + search;
  // TODO: error handling
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => response.json(res))
    .catch((e) => {
      console.log(e);
      return response.json({ error: true });
    });
}
