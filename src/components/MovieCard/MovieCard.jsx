import { Component } from 'react'
import './MovieCard.css'
import { format, parseISO } from 'date-fns'

import NoPosterImg from '../../img/poster-not-found.png'

export default class MovieCard extends Component {
  constructor(props) {
    super(props)

    this.collapseOverview = (text) => {
      if (text.length > 260) {
        const spaceIndex = text.indexOf(' ', 240)
        return `${text.slice(0, spaceIndex)} ...`
      }
      return text
    }
  }

  render() {
    const { title, date, overview, posterEndpoint } = this.props
    const posterPath = 'https://image.tmdb.org/t/p/w500'
    const formattedDate = date === '' || undefined ? '' : format(parseISO(date), 'MMMM d, y')
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
          <h3 className="card__header"> {title}</h3>
          <span className="card__date">{formattedDate}</span>
          <ul className="card__genres">
            <li className="card__genre">Action</li>
            <li className="card__genre">Drama</li>
          </ul>
          <p className="card__description">{this.collapseOverview(overview)}</p>
        </div>
      </div>
    )
  }
}
