import { useEffect, useState } from "react";
import axios from "axios";

import MovieCard from "./components/MovieCard";
import Watchlist from "./components/Watchlist";

import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);

  const [showWatchlist, setShowWatchlist] = useState(false);
  const [search, setSearch] = useState("");

  const genres = [
    "All",
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Sci-Fi"
  ];

  // Fetch movies
  useEffect(() => {
    axios
      .get("/movies.json")
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.log("Error fetching movies:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add movie
  const addToWatchlist = (movie) => {
    const alreadyAdded = watchlist.some(
      (item) => item.id === movie.id
    );

    if (!alreadyAdded) {
      setWatchlist([...watchlist, movie]);
    }
  };

  // Remove movie
  const removeFromWatchlist = (movieId) => {
    setWatchlist(
      watchlist.filter((movie) => movie.id !== movieId)
    );
  };

  // Search + genre filter
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "All" ||
      movie.genre === selectedGenre;

    const matchesSearch =
      movie.title
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  // Open movies section
  const showMovies = () => {
    setShowWatchlist(false);

    setTimeout(() => {
      document
        .getElementById("movies")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }, 100);
  };

  // Open genres
  const showGenres = () => {
    setShowWatchlist(false);

    setTimeout(() => {
      document
        .getElementById("genres")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }, 100);
  };

  // Open watchlist
  const openWatchlist = () => {
    setShowWatchlist(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="nav-logo">
          <span className="logo-icon">🎬</span>

          <div>
            <h1>MovieFlix</h1>
            <small>Watch. Discover. Enjoy.</small>
          </div>
        </div>

        <div className="nav-links">

          <button onClick={showMovies}>
            Home
          </button>

          <button onClick={showMovies}>
            Movies
          </button>

          <button onClick={showGenres}>
            Genres
          </button>

        </div>

        <button
          className="nav-watchlist"
          onClick={openWatchlist}
        >
          🔖 Watchlist

          <span>
            {watchlist.length}
          </span>
        </button>

      </nav>


      {/* ================= WATCHLIST ================= */}

      {showWatchlist ? (

        <main>

          <button
            className="back-button"
            onClick={() => setShowWatchlist(false)}
          >
            ← Back to Movies
          </button>

          <Watchlist
            watchlist={watchlist}
            onRemove={removeFromWatchlist}
          />

        </main>

      ) : (

        <main>

          {/* ================= HERO ================= */}

          <section className="hero" id="home">

            <div className="hero-content">

              <span className="hero-tag">
                🍿 YOUR MOVIE DESTINATION
              </span>

              <h2>
                Discover Your
                <br />
                Next <span>Favorite Movie</span>
              </h2>

              <p>
                Explore exciting movies across different
                genres and build your personal watchlist.
                Find something great to watch tonight.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-btn"
                  onClick={showMovies}
                >
                  🎬 Explore Movies
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
                  src="https://picsum.photos/seed/moviehero/400/550"
                  alt="Featured movie"
                />

                <div className="hero-rating">
                  ⭐ 8.7
                </div>
              </div>

            </div>

          </section>


          {/* ================= STATS ================= */}

          <section className="stats">

            <div>
              <strong>{movies.length}+</strong>
              <span>Movies</span>
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


          {/* ================= FEATURED ================= */}

          <section className="featured">

            <div className="section-header">

              <div>
                <span className="section-label">
                  FEATURED
                </span>

                <h2>Popular Picks</h2>

                <p>
                  A few movies you might enjoy
                </p>
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

                      <span>
                        ⭐ {movie.rating}
                      </span>

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


          {/* ================= SEARCH ================= */}

          <section
            className="movies-area"
            id="movies"
          >

            <div className="section-header">

              <div>

                <span className="section-label">
                  MOVIE LIBRARY
                </span>

                <h2>Explore Movies</h2>

                <p>
                  Find your next movie to watch
                </p>

              </div>

              <div className="movie-total">
                {filteredMovies.length} movies
              </div>

            </div>


            {/* Search */}

            <div className="search-box">

              <span>🔎</span>

              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
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


            {/* ================= GENRES ================= */}

            <div
              className="genre-section"
              id="genres"
            >

              <div className="genre-title">
                <h3>Browse by Genre</h3>
              </div>

              <div className="genre-buttons">

                {genres.map((genre) => (

                  <button
                    key={genre}
                    onClick={() =>
                      setSelectedGenre(genre)
                    }
                    className={
                      selectedGenre === genre
                        ? "active"
                        : ""
                    }
                  >
                    {genre}
                  </button>

                ))}

              </div>

            </div>


            {/* ================= MOVIES ================= */}

            {loading ? (

              <div className="loading">

                <div className="spinner"></div>

                <h3>Loading movies...</h3>

                <p>
                  Getting the latest movies for you
                </p>

              </div>

            ) : filteredMovies.length === 0 ? (

              <div className="no-movies">

                <div>🎬</div>

                <h3>No movies found</h3>

                <p>
                  Try another movie name or genre.
                </p>

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
                      onAdd={() =>
                        addToWatchlist(movie)
                      }
                      isAdded={isAdded}
                    />

                  );
                })}

              </div>

            )}

          </section>

        </main>

      )}


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <div className="footer-logo">
              🎬 MovieFlix
            </div>

            <p>
              Discover movies, build your watchlist,
              and find something great to watch.
            </p>

          </div>


          <div className="footer-column">

            <h3>Explore</h3>

            <button onClick={showMovies}>
              Movies
            </button>

            <button onClick={showGenres}>
              Genres
            </button>

            <button onClick={openWatchlist}>
              Watchlist
            </button>

          </div>


          <div className="footer-column">

            <h3>Genres</h3>

            <button
              onClick={() => {
                setSelectedGenre("Action");
                showMovies();
              }}
            >
              Action
            </button>

            <button
              onClick={() => {
                setSelectedGenre("Comedy");
                showMovies();
              }}
            >
              Comedy
            </button>

            <button
              onClick={() => {
                setSelectedGenre("Drama");
                showMovies();
              }}
            >
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

          <p>
            © 2026 MovieFlix. All rights reserved.
          </p>

          <p>
            Made for movie lovers 🍿
          </p>

        </div>

      </footer>


      {/* Back to top */}

      <button
        className="top-button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }
      >
        ↑
      </button>

    </div>
  );
}

export default App;