import './App.css'

import { Component } from 'react'
import { debounce } from 'lodash'

import MovieCardList from '../MovieCardList/MovieCardList'
import SearchBar from '../SearchBar/SearchBar'
import ApiService from '../../services/ApiService'
import Paginator from '../Paginator/Paginator'

export default class App extends Component {
  apiService = new ApiService()

  constructor(props) {
    super(props)
    this.state = {
      query: 'man',
      movies: [],
      currentPage: 1,
      totalPages: 5,
      loading: true,
      error: false,
      errorText: null,
    }
  }

  componentDidMount() {
    this.updateMovieList()
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, currentPage } = this.state
    if (query !== prevState.query) {
      this.onPageChange(1)
      this.updateMovieList()
    } else if (currentPage !== prevState.currentPage) {
      this.updateMovieList()
    }
  }

  onError = (e) => {
    this.setState({ error: true, errorText: e.message })
  }

  onLoaded = () => {
    this.setState({ loading: false })
  }

  // eslint-disable-next-line react/sort-comp
  startLoading = () => {
    this.setState({ loading: true })
  }

  onQueryChange = (evt) => {
    this.setState({ query: evt.target.value })
  }

  onQueryChangeDelayed = debounce(this.onQueryChange, 1000)

  onPageChange = (page) => {
    this.setState({ currentPage: page })
  }

  updateMovieList() {
    this.startLoading()
    const { query, currentPage } = this.state
    this.apiService
      .getSearchedMovies(query, currentPage)
      .then(([result, pages]) => {
        // eslint-disable-next-line react/no-unused-state
        this.setState({ movies: result, totalPages: pages > 500 ? 500 : pages })
      })
      .then(this.onLoaded)
      .catch(this.onError)
  }

  render() {
    const { movies, loading, error, query, errorText, currentPage, totalPages } = this.state
    return (
      <div className="wrapper">
        <SearchBar onQueryChange={this.onQueryChangeDelayed} />
        <MovieCardList movies={movies} loading={loading} error={error} query={query} errorText={errorText} />
        <Paginator currentPage={currentPage} onChange={this.onPageChange} totalPages={totalPages} />
      </div>
    )
  }
}
