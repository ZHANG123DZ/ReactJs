import { useState,  useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [posts, setPosts] = useState([])
  const [numPosts, setNumPosts] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [inputSearch, setInputSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let skipPosts = (currentPage-1)*numPosts
    fetch(`https://dummyjson.com/posts?limit=${numPosts}&skip=${skipPosts}`)
    .then(res => res.json())
    .then(data => {
      setIsLoading(false)
      if (inputSearch) {
        data = data.posts.filter(posts => posts.title.toLowerCase().includes(inputSearch))
        setPosts(data)
        setTotalPage(Math.ceil(data.length/numPosts))
      } else {
        setPosts(data.posts)
        setTotalPage(Math.ceil(data.total/numPosts))
      }
    })
  }, [currentPage, numPosts, inputSearch])
  
  return (
    <div className="app">
      <h1>Danh sách bài viết</h1>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm bài viết..."
          onInput={(event) => {
            let searchValue = event.currentTarget.value.trim().toLowerCase()
            searchValue.length>3?setInputSearch(searchValue):null}}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading?<div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>:null}
      
      {/* No Results Message */}
      {!posts.length?<p className="no-results">Không tìm thấy bài viết nào.</p>:<></>}
      
      {/* List of Posts */}
      <ul className="post-list">
        {posts.map((item) => (
          <li className="post-item" key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.body}</p>

          <div className="post-meta">
            <span className="views">👀 {item.views} lượt xem</span>
            <span className="likes">👍 {item.reactions.likes}</span>
            <span className="dislikes">👎 {item.reactions.dislikes}</span>
          </div>

          <div className="tags">
            {item.tags.map((tag, index) => (
              <span className="tag" key={index}>{tag}</span>
            ))}         
          </div>
        </li>
        ))}
      </ul>
      {/* Pagination */}
      <div className="pagination-container">
        <div className="records-per-page">
          <label htmlFor="records">Hiển thị:</label>
          <select id="records" className="records-select" onChange={(event) => {
            setNumPosts(Number(event.currentTarget.value))
            setCurrentPage(1)
          }}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
        <div className="pagination">
          <button className="page-btn prev" onClick={() => currentPage-1>=1 ? setCurrentPage(currentPage-1):setCurrentPage(currentPage)}>« Trước</button>
          {Array(totalPage).slice(0, 3).fill(1).map((btn, index)=> (
              currentPage+index<=totalPage?<button className={index===0 ? "page-btn active" : "page-btn"} key={currentPage+index} id={currentPage+index} onClick={() => setCurrentPage(currentPage+index)}>{currentPage+index}</button>:null
          ))}
          <button className="page-btn next" onClick={() => currentPage+1<=totalPage ? setCurrentPage(currentPage+1):setCurrentPage(currentPage)}>Sau »</button>
        </div>
      </div>
    </div>
  );
}

export default App
