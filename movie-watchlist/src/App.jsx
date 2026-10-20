import { useEffect, useState } from "react";
import axios from "axios";

import MovieCard from "./components/MovieCard";
import Watchlist from "./components/Watchlist";

import "./App.css";

// Public API — no API key required
const API_URL = "https://api.tvmaze.com/shows?page=0";

const genreMap = {
  Action: "Action",
  Comedy: "Comedy",
  Drama: "Drama",
  Horror: "Horror",
  "Science-Fiction": "Sci-Fi",
};

function App() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const genres = [
    "All",
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi",
  ];

  // Fetch shows from the public TVmaze API
  async function fetchMovies() {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      const formattedMovies = response.data.map((show) => {
        const showGenres = show.genres
          .map((genre) => genreMap[genre])
          .filter(Boolean);

        return {
          id: show.id,
          title: show.name,
          genre: showGenres.join(" • ") || "Other",
          genres: showGenres,
          year: show.premiered
            ? show.premiered.slice(0, 4)
            : "N/A",
          rating: Number(
            show.rating?.average || 0
          ).toFixed(1),
          imageUrl:
            show.image?.medium ||
            show.image?.original ||
            "https://placehold.co/400x600?text=No+Poster",
        };
      });

      setMovies(formattedMovies);
    } catch (error) {
      console.error("Error fetching shows:", error);
      setError(
        "Unable to load shows. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Fetch data when the app loads
  useEffect(() => {
    fetchMovies();
  }, []);

  // Add a show to the watchlist
  const addToWatchlist = (movie) => {
    setWatchlist((currentWatchlist) => {
      const alreadyAdded = currentWatchlist.some(
        (item) => item.id === movie.id
      );

      if (alreadyAdded) {
        return currentWatchlist;
      }

      return [...currentWatchlist, movie];
    });
  };

  // Remove a show from the watchlist
  const removeFromWatchlist = (movieId) => {
    setWatchlist((currentWatchlist) =>
      currentWatchlist.filter(
        (movie) => movie.id !== movieId
      )
    );
  };

  // Search and filter by genre
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "All" ||
      movie.genres.includes(selectedGenre);

    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase().trim());

    return matchesGenre && matchesSearch;
  });

  // Scroll to a section
  const scrollToSection = (id) => {
    setShowWatchlist(false);

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const showMovies = () => scrollToSection("movies");
  const showGenres = () => scrollToSection("genres");

  // Open the watchlist
  const openWatchlist = () => {
    setShowWatchlist(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Select a genre from the footer
  const selectGenre = (genre) => {
    setSelectedGenre(genre);
    scrollToSection("movies");
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">🎬</span>

          <div>
            <h1>MovieFlix</h1>
           
          </div>
        </div>

        <div className="nav-links">
          <button onClick={showMovies}>Home</button>
          <button onClick={showMovies}>Shows</button>
          <button onClick={showGenres}>Genres</button>
        </div>

        <button
          className="nav-watchlist"
          onClick={openWatchlist}
        >
          🔖 Watchlist
          <span>{watchlist.length}</span>
        </button>
      </nav>

      {/* WATCHLIST */}
      {showWatchlist ? (
        <main>
          <button
            className="back-button"
            onClick={() => setShowWatchlist(false)}
          >
            ← Back to Shows
          </button>

          <Watchlist
            watchlist={watchlist}
            onRemove={removeFromWatchlist}
          />
        </main>
      ) : (
        <main>
          {/* HERO */}
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="hero-tag">
                🍿 YOUR ENTERTAINMENT DESTINATION
              </span>

              <h2>
                Discover Your
                <br />
                Next <span>Favorite Show</span>
              </h2>

              <p>
                Explore exciting shows across different
                genres and build your personal watchlist.
                Find something great to watch tonight.
              </p>

              <div className="hero-buttons">
                <button
                  className="primary-btn"
                  onClick={showMovies}
                >
                  🎬 Explore Shows
                </button>

                <button
                  className="secondary-btn"
                  onClick={openWatchlist}
                >
                  🔖 My Watchlist
                </button>
              </div>
            </div>

            <div className="hero-movie">
              <div className="hero-poster">
                <img
                  src={
                    movies[0]?.imageUrl ||
                    "https://picsum.photos/seed/moviehero/400/550"
                  }
                  alt="Featured show"
                />

                <div className="hero-rating">
                  ⭐ {movies[0]?.rating || "8.7"}
                </div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="stats">
            <div>
              <strong>{movies.length}</strong>
              <span>Shows</span>
            </div>

            <div>
              <strong>{genres.length - 1}</strong>
              <span>Genres</span>
            </div>

            <div>
              <strong>{watchlist.length}</strong>
              <span>In Watchlist</span>
            </div>

            <div>
              <strong>⭐</strong>
              <span>Top Rated</span>
            </div>
          </section>

          {/* FEATURED SHOWS */}
          <section className="featured">
            <div className="section-header">
              <div>
                <span className="section-label">
                  FEATURED
                </span>

                <h2>Popular Picks</h2>
                <p>A few shows you might enjoy</p>
              </div>

              <button
                className="view-all"
                onClick={showMovies}
              >
                View All →
              </button>
            </div>

            {!loading && movies.length > 0 && (
              <div className="featured-grid">
                {movies.slice(0, 4).map((movie) => (
                  <div
                    className="featured-card"
                    key={movie.id}
                  >
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                    />

                    <div className="featured-overlay">
                      <span>⭐ {movie.rating}</span>
                      <h3>{movie.title}</h3>

                      <p>
                        {movie.genre} • {movie.year}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SHOW LIBRARY */}
          <section className="movies-area" id="movies">
            <div className="section-header">
              <div>
                <span className="section-label">
                  SHOW LIBRARY
                </span>

                <h2>Explore Shows</h2>
                <p>Find your next show to watch</p>
              </div>

              <div className="movie-total">
                {filteredMovies.length} shows
              </div>
            </div>

            {/* SEARCH */}
            <div className="search-box">
              <span>🔎</span>

              <input
                type="text"
                placeholder="Search shows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* GENRES */}
            <div className="genre-section" id="genres">
              <div className="genre-title">
                <h3>Browse by Genre</h3>
              </div>

              <div className="genre-buttons">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={
                      selectedGenre === genre ? "active" : ""
                    }
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* SHOW RESULTS */}
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <h3>Loading shows...</h3>
                <p>Getting shows for you</p>
              </div>
            ) : error ? (
              <div className="no-movies">
                <div>⚠️</div>
                <h3>Unable to load shows</h3>
                <p>{error}</p>

                <button onClick={fetchMovies}>
                  Try Again
                </button>
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="no-movies">
                <div>🎬</div>
                <h3>No shows found</h3>
                <p>Try another show name or genre.</p>

                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedGenre("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="movie-grid">
                {filteredMovies.map((movie) => {
                  const isAdded = watchlist.some(
                    (item) => item.id === movie.id
                  );

                  return (
                    <MovieCard
                      key={movie.id}
                      title={movie.title}
                      genre={movie.genre}
                      year={movie.year}
                      rating={movie.rating}
                      imageUrl={movie.imageUrl}
                      onAdd={() => addToWatchlist(movie)}
                      isAdded={isAdded}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              🎬 MovieFlix
            </div>

            <p>
              Discover shows, build your watchlist,
              and find something great to watch.
            </p>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <button onClick={showMovies}>Shows</button>
            <button onClick={showGenres}>Genres</button>
            <button onClick={openWatchlist}>Watchlist</button>
          </div>

          <div className="footer-column">
            <h3>Genres</h3>

            <button onClick={() => selectGenre("Action")}>
              Action
            </button>

            <button onClick={() => selectGenre("Comedy")}>
              Comedy
            </button>

            <button onClick={() => selectGenre("Drama")}>
              Drama
            </button>
          </div>

          <div className="footer-column">
            <h3>Follow Us</h3>

            <div className="social-icons">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 MovieFlix. All rights reserved.</p>
          <p>Made for entertainment lovers 🍿</p>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <button
        className="top-button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
      >
        ↑
      </button>
    </div>
  );
}

export default App;