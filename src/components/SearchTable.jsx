import React from 'react'

const SearchTable = ({ query }) => {
  return (
    <div>
        <h1>Search Results</h1>
        <h1>{query}</h1>
    </div>
  )
}

export default SearchTable