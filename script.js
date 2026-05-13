// =========================
// script.js
// =========================

// TMDB API KEY
const apiKey = "bd679a4704beed38c17173e854409a8f";

// MOVIE CONTAINER
const moviesContainer = document.getElementById("moviesContainer");

// =========================
// SEARCH MOVIES
// =========================
async function searchMovie() {
  const input = document
    .getElementById("searchInput")
    .value.trim();

  // CHECK EMPTY INPUT
  if (input === "") {
    alert("Please enter a movie name");
    return;
  }

  // API URL
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${input}`;

  try {
    // FETCH DATA
    const response = await fetch(url);
    const data = await response.json();

    // DISPLAY RESULTS
    displayMovies(data.results);

  } catch (error) {
    console.error(error);

    moviesContainer.innerHTML = `
      <h2 class="error">
        Something went wrong. Please try again.
      </h2>
    `;
  }
}

// =========================
// DISPLAY MOVIES
// =========================
function displayMovies(movies) {

  // CLEAR PREVIOUS MOVIES
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

  // LOOP THROUGH MOVIES
  movies.forEach((movie) => {

    // CREATE MOVIE CARD
    const movieCard = document.createElement("div");

    movieCard.classList.add("movie-card");

    // FIX MISSING POSTERS
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://via.placeholder.com/500x750?text=No+Image";

    // MOVIE HTML
    movieCard.innerHTML = `
      <img src="${poster}" alt="${movie.title}">

      <div class="movie-info">

        <h3>${movie.title}</h3>

        <p>
          ${movie.release_date || "Release date unavailable"}
        </p>

        <span>
          ⭐ ${movie.vote_average || "N/A"}
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

    // APPEND CARD
    moviesContainer.appendChild(movieCard);
  });
}

// =========================
// WATCH TRAILER
// =========================
function watchTrailer(title) {

  const youtubeSearch =
    `https://www.youtube.com/results?search_query=${title}+official+trailer`;

  window.open(youtubeSearch, "_blank");
}

// =========================
// ADD TO WATCHLIST
// =========================
function addToWatchlist(movie) {

  // GET EXISTING WATCHLIST
  let watchlist =
    JSON.parse(localStorage.getItem("watchlist")) || [];

  // CHECK DUPLICATES
  const exists = watchlist.find(
    (item) => item.id === movie.id
  );

  if (exists) {
    alert("Movie already in watchlist");
    return;
  }

  // ADD MOVIE
  watchlist.push(movie);

  // SAVE
  localStorage.setItem(
    "watchlist",
    JSON.stringify(watchlist)
  );

  alert(`${movie.title} added to watchlist`);
}

// =========================
// ENTER KEY SEARCH
// =========================
document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
      searchMovie();
    }
  });

// =========================
// DARK / LIGHT MODE
// =========================
const toggleBtn = document.createElement("button");

toggleBtn.innerText = "🌙 Mode";

toggleBtn.classList.add("mode-btn");

document.querySelector("header").appendChild(toggleBtn);

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// =========================
// SIMPLE LOGIN SYSTEM
// =========================
function login() {

  const username = prompt("Enter Username");

  if (username) {

    localStorage.setItem("user", username);

    alert(`Welcome ${username}`);
  }
}

// =========================
// AUTO LOGIN CHECK
// =========================
window.onload = () => {

  const user = localStorage.getItem("user");

  if (!user) {
    login();
  }
};