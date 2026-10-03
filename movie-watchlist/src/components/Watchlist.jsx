function Watchlist({ watchlist, onRemove }) {
  return (
    <section className="watchlist-section">

      <div className="section-heading">
        <div>
          <h2>🔖 My Watchlist</h2>
          <p>Movies you saved to watch later</p>
        </div>

        <span className="watchlist-count">
          {watchlist.length} movie
          {watchlist.length !== 1 ? "s" : ""}
        </span>
      </div>

      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <div className="empty-icon">🎬</div>

          <h3>Your watchlist is empty</h3>

          <p>
            Add your favorite movies to see them here.
          </p>
        </div>
      ) : (
        <div className="movie-grid">

          {watchlist.map((movie) => (
            <div className="movie-card" key={movie.id}>

              <div className="poster-container">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                />

                <span className="rating-badge">
                  ⭐ {movie.rating}
                </span>
              </div>

              <div className="movie-info">

                <h2>{movie.title}</h2>

                <p className="movie-details">
                  {movie.genre} • {movie.year}
                </p>

                <button
                  className="remove-btn"
                  onClick={() => onRemove(movie.id)}
                >
                  🗑 Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
}

export default Watchlist;