import './SearchBar.css'

function SearchBar({ onQueryChange }) {
  return <input className="search-bar" type="text" placeholder="Type to search..." onChange={onQueryChange} />
}

export default SearchBar
