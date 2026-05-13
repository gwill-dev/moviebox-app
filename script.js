// ===============================
// MOVIEBOX APP
// script.js
// ===============================

// ===============================
// TMDB API KEY
// ===============================
const apiKey = "bd679a4704beed38c17173e854409a8f";

// ===============================
// HTML ELEMENTS
// ===============================
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

    moviesContainer.innerHTML = `
      <h2 class="error">
        Failed to load movies
      </h2>
    `;
  }
}

// ===============================
// SEARCH MOVIES
// ===============================
async function searchMovie() {

  const input =
    searchInput.value.trim();

  // EMPTY INPUT
  if (input === "") {

    alert("Please enter a movie name");

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

    moviesContainer.innerHTML = `
      <h2 class="error">
        Something went wrong
      </h2>
    `;
  }
}

// ===============================
// DISPLAY MOVIES
// ===============================
function displayMovies(movies) {

  // CLEAR CONTAINER
  moviesContainer.innerHTML = "";

  // NO MOVIES FOUND
  if (movies.length === 0) {

    moviesContainer.innerHTML = `
      <h2 class="error">
        No movies found
      </h2>
    `;

    return;
  }

  // LOOP MOVIES
  movies.forEach((movie) => {

    // FIX MISSING POSTER
    const poster =
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    // CREATE CARD
    const movieCard =
      document.createElement("div");

    movieCard.classList.add("movie-card");

    // CARD HTML
    movieCard.innerHTML = `

      <img
        src="${poster}"
        alt="${movie.title}"
      >

      <div class="movie-info">

        <h3>
          ${movie.title}
        </h3>

        <p>
          ${movie.release_date || "Unknown Date"}
        </p>

        <span>
          ⭐ ${movie.vote_average || "N/A"}
        </span>

        <div class="buttons">

          <button
            onclick="watchTrailer('${movie.title}')"
          >
            Trailer
          </button>

          <button
            onclick='addToWatchlist(${JSON.stringify(movie)})'
          >
            +
          </button>

        </div>

      </div>
    `;

    // ADD CARD
    moviesContainer.appendChild(movieCard);
  });
}

// ===============================
// WATCH TRAILER
// ===============================
function watchTrailer(title) {

  const youtubeUrl =
    `https://www.youtube.com/results?search_query=${title}+official+trailer`;

  window.open(youtubeUrl, "_blank");
}

// ===============================
// ADD TO WATCHLIST
// ===============================
function addToWatchlist(movie) {

  let watchlist =
    JSON.parse(
      localStorage.getItem("watchlist")
    ) || [];

  // CHECK DUPLICATE
  const exists =
    watchlist.find(
      (item) => item.id === movie.id
    );

  if (exists) {

    alert("Movie already added");

    return;
  }

  // ADD MOVIE
  watchlist.push(movie);

  // SAVE
  localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
  );

  alert(`${movie.title} added`);

  loadWatchlist();
}

// ===============================
// LOAD WATCHLIST
// ===============================
function loadWatchlist() {

  // CHECK CONTAINER
  if (!watchlistContainer) return;

  const watchlist =
    JSON.parse(
      localStorage.getItem("watchlist")
    ) || [];

  watchlistContainer.innerHTML = "";

  // EMPTY WATCHLIST
  if (watchlist.length === 0) {

    watchlistContainer.innerHTML = `
      <h3 class="error">
        No movies in watchlist
      </h3>
    `;

    return;
  }

  // LOOP WATCHLIST
  watchlist.forEach((movie) => {

    const poster =
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://via.placeholder.com/500x750?text=No+Image";

    const movieCard =
      document.createElement("div");

    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `

      <img
        src="${poster}"
        alt="${movie.title}"
      >

      <div class="movie-info">

        <h3>
          ${movie.title}
        </h3>

        <p>
          ${movie.release_date || "Unknown"}
        </p>

        <span>
          ⭐ ${movie.vote_average}
        </span>

      </div>
    `;

    watchlistContainer.appendChild(movieCard);
  });
}

// ===============================
// SEARCH WITH ENTER KEY
// ===============================
searchInput.addEventListener(
  "keypress",
  function (event) {

    if (event.key === "Enter") {

      searchMovie();
    }
  }
);

// ===============================
// DARK / LIGHT MODE
// ===============================
const modeButton =
  document.createElement("button");

modeButton.innerText = "🌙 Mode";

modeButton.classList.add("mode-btn");

document
  .querySelector("header")
  .appendChild(modeButton);

modeButton.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light-mode"
    );
  }
);

// ===============================
// SIMPLE LOGIN
// ===============================
function login() {

  const username =
    prompt("Enter Username");

  if (username) {

    localStorage.setItem(
      "user",
      username
    );

    alert(`Welcome ${username}`);
  }
}

// ===============================
// START APP
// ===============================
window.onload = () => {

  // LOGIN CHECK
  const user =
    localStorage.getItem("user");

  if (!user) {

    login();
  }

  // LOAD DATA
  loadTrendingMovies();

  loadWatchlist();
};
