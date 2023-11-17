import { Offline, Online } from 'react-detect-offline'

import MovieCard from '../MovieCard/MovieCard'
import LoadIndicator from '../LoadIndicator/LoadIndicator'
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator'
import './MovieCardList.css'

export default function MovieCardList(props) {
  const { movies, loading, error, errorText, guestSessionId, onRatingChange } = props
  const movieElements = movies.map((movie) => {
    return (
      <MovieCard
        globalRating={movie.vote_average}
        key={movie.id}
        movieId={movie.id}
        genres={movie.genre_ids}
        title={movie.title}
        date={movie.release_date}
        overview={movie.overview}
        posterEndpoint={movie.poster_path}
        guestSessionId={guestSessionId}
        onRatingChange={onRatingChange}
        rating={movie.rating || Number(localStorage.getItem(movie.id)) || 0}
      />
    )
  })

  const spinner = loading && !error ? <LoadIndicator /> : null
  const errorMessage = error ? <ErrorIndicator message={errorText} /> : null
  const content = !loading && !error ? movieElements : null
  const noFilms = movies.length === 0 && !loading ? <p>Sorry, but there are no films satisfying the request</p> : null

  return (
    <div className="movie-list">
      <Online className="movie-list__online">
        {spinner}
        {noFilms}
        {errorMessage}
        {content}
      </Online>
      <Offline className="movie-list__offline">
        <ErrorIndicator message="Наблюдаются проблемы с сетью. Пожалуйста, проверьте подключение." />
      </Offline>
    </div>
  )
}
