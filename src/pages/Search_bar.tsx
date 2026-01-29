import { useState, useEffect } from "react"
import { searchSong } from "../api/song.api"
import { Link } from "react-router-dom"
const Search_bar = () => {
  const [results, setResults] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)

  console.log(results)

  useEffect(() => {
    if (!searchQuery) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await searchSong(searchQuery)
        setResults(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }, 500) // wait 500ms after typing stops

    return () => clearTimeout(delayDebounce) // cleanup if user types again
  }, [searchQuery])

  return (
    <div className="search bg-red-950/25 fixed w-full h-full z-50">
      <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-red-950/25 rounded-lg px-4 py-2 shadow-md hover:shadow-2xl transition-all duration-300 min-w-1/2">
        <div className="top_layer flex items-center justify-between">
          <input
            type="text"
            className="border border-red-950/25 rounded-lg px-4 py-2 w-full"
            placeholder="Search by name, artist or category"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <p className="cursor-pointer ml-2 text-red-950 hover:text-red-600 font-bold">{results.length} </p>
          <span
            className="cursor-pointer ml-4 text-red-950 hover:text-red-600 font-bold"
            onClick={() => {
              localStorage.setItem("search_bar", "off")
              window.location.reload()
            }}
          >
            X
          </span>
        </div>

        <div className="resluts mt-2">
          {loading && <p className="text-center italic">Loading...</p>}
          {!loading && results.length === 0 && searchQuery && (
            <p className="text-center italic">No results found</p>
          )}
          <div className="results">
            <p className="font-semibold">Results </p>
            {results.map((result: any) => (
              <Link to={`/songs/${result.id}`} key={result.id} className="border-b py-2">
                <div key={result.id} className="border-b py-2 bg-[#e8d0d0a6] p-2 rounded-md my-2 hover:bg-[#e8d0d0]">
                <p className="font-semibold">{result.name}</p>
                <div className="more flex justify-between">
                    {/* <span>{result.id}</span> */}
                    <span className="text-sm text-gray-600">{result.artist}</span>
                    <span className="text-sm text-gray-600">{result.category}</span>
                </div>
              </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search_bar
