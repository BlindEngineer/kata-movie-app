import { Component } from 'react'
import './MovieCard.css'
import { format, parseISO } from 'date-fns'
import { Rate } from 'antd'

import NoPosterImg from '../../img/poster-not-found.png'
import GenresContext from '../GenreContext/GenresContext'

export default class MovieCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stateRating: null,
    }

    this.collapseOverview = (text, length) => {
      if (text.length > length) {
        const spaceIndex = text.indexOf(' ', length - 5)
        return spaceIndex !== -1 ? `${text.slice(0, spaceIndex)} ...` : `${text}`
      }
      return text
    }

    this.getRelatedGenres = (allGenres, neededGenres) => {
      return allGenres.filter((elem) => {
        return neededGenres.includes(elem.id)
      })
    }
  }

  setRate = (value) => {
    const { guestSessionId, movieId, onRatingChange } = this.props
    onRatingChange(value, guestSessionId, movieId)
    this.setState(() => {
      return { stateRating: value }
    })
  }

  render() {
    const { title, date, overview, posterEndpoint, globalRating, genres, rating } = this.props
    const { stateRating } = this.state
    const allGenres = this.context
    const posterPath = 'https://image.tmdb.org/t/p/w500'
    const formattedDate = date === '' || undefined ? '' : format(parseISO(date), 'MMMM d, y')
    let ratingClassnames = 'card__rating'
    if (globalRating < 3) {
      ratingClassnames += ' card__rating--red'
    } else if (globalRating < 5) {
      ratingClassnames += ' card__rating--orange'
    } else if (globalRating < 7) {
      ratingClassnames += ' card__rating--yellow'
    } else if (globalRating >= 7) {
      ratingClassnames += ' card__rating--green'
    } else {
      ratingClassnames += ' card__rating--no-rating'
    }
    const genresList = this.getRelatedGenres(allGenres, genres)
    const genresElements = genresList.map((genre) => {
      return (
        <li key={genre.id} className="card__genre">
          {genre.name}
        </li>
      )
    })

    return (
      <div className="card">
        <div className="card__image-block">
          <img
            className="card__image"
            alt="Film Poster"
            src={posterEndpoint ? posterPath + posterEndpoint : NoPosterImg}
          />
        </div>
        <div className="card__information">
          <div className={ratingClassnames}>{globalRating.toFixed(1)}</div>
          <h3 className="card__header"> {this.collapseOverview(title, 30)}</h3>
          <span className="card__date">{formattedDate}</span>
          <ul className="card__genres">{genresElements}</ul>
          <div className="card__text-and-rate">
            <p className="card__description">{this.collapseOverview(overview, 165)}</p>
            <Rate
              allowHalf
              className="card__stars"
              count={10}
              allowClear={false}
              value={stateRating || rating}
              style={{
                fontSize: 15,
              }}
              defaultValue={0}
              onChange={this.setRate}
            />
          </div>
        </div>
      </div>
    )
  }
}

MovieCard.contextType = GenresContext
