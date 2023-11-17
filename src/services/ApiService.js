export default class ApiService {
  constructor() {
    this.urlBasis = 'https://api.themoviedb.org/3/'
    this.sessionUrl = `${this.urlBasis}authentication/guest_session/new`
    this.genresUrl = `${this.urlBasis}genre/movie/list?language=en`
    this.apiKey = 'e42ea98f8ca050aeb062e469ae7fbfd4'

    this.constructUrl = (query, page) => {
      return `${this.urlBasis}search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`
    }

    this.constructRatedUrl = (guestSessionId, page) => {
      return `${this.urlBasis}guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${page}`
    }

    this.constructRatingUrl = (guestSessionId, movieId) => {
      return `${this.urlBasis}movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    }

    this.getResource = async (url, options) => {
      const result = await fetch(url, options)
      if (!result.ok) {
        throw new Error(`Could not fetch ${url}. Received status ${result.status}`)
      }
      return result.json()
    }
  }

  requestOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNDJlYTk4ZjhjYTA1MGFlYjA2MmU0NjlhZTdmYmZkNCIsInN1YiI6IjY1MzgyNDQ3N2ZjYWIzMDBhZDdlNjRlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Bf3DyYuMWR4iRAOZg2k0ErRdUuCZVxwoG_IiLDHxl2k',
    },
  }

  async createGuestSession() {
    const response = await this.getResource(this.sessionUrl, this.requestOptions)
    return response.guest_session_id
  }

  async getSearchedMovies(query, page) {
    const data = await this.getResource(this.constructUrl(query, page), this.requestOptions)
    return [data.results, data.total_pages]
  }

  async getRatedMovies(guestSessionId, page) {
    const data = await this.getResource(this.constructRatedUrl(guestSessionId, page))
    return [data.results, data.total_pages]
  }

  async getGenres() {
    const data = await this.getResource(this.genresUrl, this.requestOptions)
    return data.genres
  }

  async postRating(valueMark, guestSessionId, movieId) {
    return this.getResource(this.constructRatingUrl(guestSessionId, movieId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: valueMark }),
    })
  }
}
