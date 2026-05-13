// ===============================
// MOVIEBOX APP
// ===============================

// API KEY
const apiKey = "bd679a4704beed38c17173e854409a8f";

// CONTAINERS
const moviesContainer =
  document.getElementById("moviesContainer");

const watchlistContainer =
  document.getElementById("watchlistContainer");

const searchInput =
  document.getElementById("searchInput");

// ===============================
// LOAD TRENDING MOVIES
// ===============================
async function loadTrendingMovies() {

  const url =
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

  try {

    const response = await fetch(url);

    const data = await response.json();

    displayMovies(data.results);

  } catch (error) {

    console.error(error);

    moviesContainer.innerHTML =
      `<h2>Failed to load movies</h2>`;
  }
}

// ===============================
// SEARCH MOVIES
// ===============================
async function searchMovie() {

  const input =
    searchInput.value.trim();

  if (input === "") {

    alert("Enter movie name");

    return;
  }

  const url =
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${input}`;

  try {

    const response =
      await fetch(url);

    const data =
      await response.json();

    displayMovies(data.results);

  } catch (error) {

    console.error(error);

    moviesContainer.innerHTML =
      `<h2>Search failed</h2>`;
  }
}

// ===============================
// DISPLAY MOVIES
// ===============================
function displayMovies(movies) {

  moviesContainer.innerHTML = "";

  if (!movies || movies.length === 0) {

    moviesContainer.innerHTML =
      `<h2>No movies found</h2>`;

    return;
  }

  movies.forEach((movie) => {

    const poster =
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    const movieCard =
      document.createElement("div");

    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `

      <img src="${poster}" alt="${movie.title}">

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <p>${movie.release_date || "Unknown"}</p>

        <span>
          ⭐ ${movie.vote_average}
        </span>

        <div class="buttons">

          <button onclick="watchTrailer('${movie.title}')">
            Trailer
          </button>

          <button onclick='addToWatchlist(${JSON.stringify(movie)})'>
            +
          </button>

        </div>

      </div>
    `;

    moviesContainer.appendChild(movieCard);
  });
}

// ===============================
// TRAILER
// ===============================
function watchTrailer(title) {

  const youtubeUrl =
    `https://www.youtube.com/results?search_query=${title}+official+trailer`;

  window.open(youtubeUrl, "_blank");
}

// ===============================
// WATCHLIST
// ===============================
function addToWatchlist(movie) {

  let watchlist =
    JSON.parse(
      localStorage.getItem("watchlist")
    ) || [];

  const exists =
    watchlist.find(
      (item) => item.id === movie.id
    );

  if (exists) {

    alert("Already added");

    return;
  }

  watchlist.push(movie);

  localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
  );

  loadWatchlist();
}

// ===============================
// LOAD WATCHLIST
// ===============================
function loadWatchlist() {

  if (!watchlistContainer) return;

  const watchlist =
    JSON.parse(
      localStorage.getItem("watchlist")
    ) || [];

  watchlistContainer.innerHTML = "";

  watchlist.forEach((movie) => {

    const poster =
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    const card =
      document.createElement("div");

    card.classList.add("movie-card");

    card.innerHTML = `

      <img src="${poster}" alt="${movie.title}">

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <p>${movie.release_date}</p>

      </div>
    `;

    watchlistContainer.appendChild(card);
  });
}

// ===============================
// ENTER KEY SEARCH
// ===============================
searchInput.addEventListener(
  "keypress",
  function(event) {

    if (event.key === "Enter") {

      searchMovie();
    }
  }
);

// ===============================
// START APP
// ===============================
window.onload = () => {

  loadTrendingMovies();

  loadWatchlist();
};