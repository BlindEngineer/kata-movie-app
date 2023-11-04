import { Component } from 'react'
import { Offline, Online } from 'react-detect-offline'

import MovieCard from '../MovieCard/MovieCard'
import LoadIndicator from '../LoadIndicator/LoadIndicator'
import ErrorIndicator from '../ErrorIndicator/ErrorIndicator'
import './MovieCardList.css'

// eslint-disable-next-line react/prefer-stateless-function
export default class MovieCardList extends Component {
  render() {
    const { movies, loading, error, errorText } = this.props
    const movieElements = movies.map((movie) => {
      return (
        <MovieCard
          key={movie.id}
          genres={movie.genre_ids}
          title={movie.title}
          date={movie.release_date}
          overview={movie.overview}
          posterEndpoint={movie.poster_path}
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
}
