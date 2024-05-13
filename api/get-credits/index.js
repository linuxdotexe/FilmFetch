const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.auth_token}`,
  },
};
export default function GET(request, response) {
  const baseURL = "https://api.themoviedb.org/3/";
  const id = request.query.id;
  const choice = request.query.choice;
  let search = ``;
  if (choice === "movie") {
    search = `movie/${id}/credits`;
  } else {
    search = `tv/${id}`;
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
