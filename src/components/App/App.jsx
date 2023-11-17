import './App.css'

import { Component } from 'react'
import { debounce } from 'lodash'
import { Tabs } from 'antd'

import MovieCardList from '../MovieCardList/MovieCardList'
import SearchBar from '../SearchBar/SearchBar'
import ApiService from '../../services/ApiService'
import Paginator from '../Paginator/Paginator'
import GenresContext from '../GenreContext/GenresContext'

export default class App extends Component {
  apiService = new ApiService()

  constructor(props) {
    super(props)
    this.state = {
      query: 'react',
      movies: [],
      genresList: [],
      currentPage: 1,
      totalPages: 5,
      totalRatedPages: 1,
      loading: true,
      error: false,
      errorText: null,
      guestSessionId: null,
      activeTab: 'Search',
    }
  }

  componentDidMount() {
    localStorage.clear()
    this.apiService.createGuestSession().then((response) => {
      this.setState({ guestSessionId: response })
    })
    this.saveGenresList()
    this.updateMovieList()
  }

  componentDidUpdate(prevProps, prevState) {
    const { query, currentPage, activeTab, guestSessionId } = this.state
    if (guestSessionId !== prevState.guestSessionId) {
      localStorage.clear()
    }
    if (query !== prevState.query && activeTab === 'Search') {
      this.onPageChange(1)
      this.updateMovieList()
    } else if (activeTab !== prevState.activeTab) {
      this.onPageChange(1)
      if (activeTab === 'Search') {
        this.updateMovieList()
      } else {
        this.updateRatedList()
      }
    } else if (currentPage !== prevState.currentPage) {
      if (activeTab === 'Search') {
        this.updateMovieList()
      } else {
        this.updateRatedList()
      }
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

  onTabChange = (key) => {
    this.setState({ activeTab: key })
  }

  onPageChange = (page) => {
    this.setState({ currentPage: page })
  }

  updateMovieList() {
    this.startLoading()
    const { query, currentPage } = this.state
    this.apiService
      .getSearchedMovies(query, currentPage)
      .then(([result, pages]) => {
        this.setState({ movies: result, totalPages: pages > 500 ? 500 : pages })
      })
      .then(this.onLoaded)
      .catch(this.onError)
  }

  updateRatedList() {
    this.startLoading()
    const { guestSessionId, currentPage } = this.state
    this.apiService
      .getRatedMovies(guestSessionId, currentPage)
      .then(([result, pages]) => {
        this.setState({ movies: result, totalPages: pages > 500 ? 500 : pages })
      })
      .then(this.onLoaded)
      .catch(this.onError)
  }

  onRatingChange = async (value, guestSessionId, movieId) => {
    await this.apiService.postRating(value, guestSessionId, movieId)
    localStorage.setItem(movieId, value)
  }

  saveGenresList() {
    this.apiService.getGenres().then((result) => {
      this.setState({ genresList: result })
    })
  }

  render() {
    const {
      movies,
      loading,
      error,
      query,
      errorText,
      currentPage,
      totalPages,
      totalRatedPages,
      guestSessionId,
      genresList,
    } = this.state
    const searchTabContent = {
      key: 'Search',
      label: 'Search',
      children: (
        <>
          <SearchBar onQueryChange={this.onQueryChangeDelayed} />
          <MovieCardList
            movies={movies}
            loading={loading}
            error={error}
            query={query}
            errorText={errorText}
            guestSessionId={guestSessionId}
            onRatingChange={this.onRatingChange}
          />
          <Paginator currentPage={currentPage} onChange={this.onPageChange} totalPages={totalPages} />
        </>
      ),
    }
    const ratedTabContent = {
      key: 'Rated',
      label: 'Rated',
      children: (
        <>
          <MovieCardList
            movies={movies}
            loading={loading}
            error={error}
            query={query}
            errorText={errorText}
            guestSessionId={guestSessionId}
            onRatingChange={this.onRatingChange}
          />
          <Paginator currentPage={currentPage} onChange={this.onPageChange} totalPages={totalRatedPages} />
        </>
      ),
    }
    const tabsContentList = [searchTabContent, ratedTabContent]
    return (
      <GenresContext.Provider value={genresList}>
        <div className="wrapper">
          <Tabs
            items={tabsContentList}
            size="large"
            defaultActiveKey="Search"
            onChange={this.onTabChange}
            centered
            destroyInactiveTabPane
          />
        </div>
      </GenresContext.Provider>
    )
  }
}
