import React, { useState } from "react"

interface HeaderProps {
  onSearch: (query: string) => void
  onHomeClick: () => void 
}

const Header: React.FC<HeaderProps> = ({ onSearch, onHomeClick }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <nav className="navbar bg-dark border-bottom-dark" data-bs-theme="dark">
      <div className="container">
        <a className="navbar-brand" onClick={onHomeClick} style={{ cursor: "pointer" }}>
          My Recipe
        </a>
        <form className="d-flex" role="search" onSubmit={handleSubmit}>
          <input
            className="form-control me-2 "
            type="search"
            placeholder="Enter Dishes"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
        {/* <div>
        <button className="btn btn-outline-warning me-2" type="submit">
            ADD RECIPE
          </button>
        </div> */}
      </div>
    </nav>
  )
}

export default Header;
