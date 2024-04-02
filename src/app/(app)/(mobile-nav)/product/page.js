'use client'

import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { IoIosArrowBack } from 'react-icons/io'
export default function Product() {
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    handleStoreStock(keyword)
  }

  return (
    <div>
      <div id="searchBar" className="flex pt-3">
        <div className="h-full w-12 items-center justify-items-center pl-4 pt-7">
          <IoIosArrowBack className="h-5 w-5 " />
        </div>
        <form className="mx-auto w-full pl-2 pr-2.5 pt-3" onSubmit={handleSearch}>
          <label
            htmlFor="default-search"
            className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"></div>
            <input
              type="search"
              id="default-search"
              className="block w-full rounded-full border border-gray-300 bg-gray-50 p-4 ps-10 text-gray-900 focus:border-yellow-300 focus:ring-yellow-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="제품명을 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="absolute bottom-2 end-1.5 rounded-full  px-4 py-2 focus:outline-none focus:ring-4 "
            >
              <FaSearch className="text-2xl text-gray-500 " />
            </button>
          </div>
        </form>
      </div>
      <div id="body">
        <div>kadl;fjaios</div>
      </div>
    </div>
  )
}
