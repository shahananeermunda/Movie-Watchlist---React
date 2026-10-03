function MovieCard({
  title,
  genre,
  year,
  rating,
  imageUrl,
  onAdd,
  isAdded
}) {
  return (
    <div className="movie-card">

      <div className="poster-container">
        <img
          src={imageUrl}
          alt={title}
        />

        <span className="rating-badge">
          ⭐ {rating}
        </span>
      </div>

      <div className="movie-info">

        <h2>{title}</h2>

        <p className="movie-details">
          {genre} • {year}
        </p>

        <button
          onClick={onAdd}
          disabled={isAdded}
          className={isAdded ? "added-btn" : ""}
        >
          {isAdded ? "✓ Added" : "+ Add to Watchlist"}
        </button>

      </div>

    </div>
  );
}

export default MovieCard;