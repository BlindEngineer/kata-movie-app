export default class ApiService {
  constructor() {
    this.constructUrl = (query, page) => {
      return `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`
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

  async getResource(url) {
    const result = await fetch(url, this.requestOptions)
    if (!result.ok) {
      throw new Error(`Could not fetch ${url}. Received status ${result.status}`)
    }
    return result.json()
  }

  async getSearchedMovies(query, page) {
    const data = await this.getResource(this.constructUrl(query, page))
    return [data.results, data.total_pages]
  }
}
