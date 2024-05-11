const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.auth_token}`,
  },
};
export default function GET(request, response) {
  const baseURL = "https://api.themoviedb.org/3/";
  const movieName = request.query.movieName;
  // TODO: look into this later
  // NOTE: fetch causing trouble at will.
  // const movieSearch = `search/multi?query=${movieName}`;
  const movieSearch = `search/movie?query=${movieName}`;
  const url = baseURL + movieSearch;
  // TODO: error handling
  fetch(url, options)
    .then((res) => res.json())
    .then((res) => response.json(res))
    .catch((e) => {
      console.log(e);
      return response.json({ error: true });
    });
}
