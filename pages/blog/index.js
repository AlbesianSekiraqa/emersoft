"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Pagination from "../../src/components/pagination/pagination";
import "../../app/globals.css";
import Card from "@/src/components/card";

const clearSearch = () => {
  const baseUrl = window.location.href.split("?")[0];
  window.location.href = baseUrl;
};

export default function Home({ posts }) {
  const [categories] = useState(posts.categories);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts ? posts.posts : []);
  const [paginatedPosts, setPaginatedPosts] = useState(filteredPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const router = useRouter();

  useEffect(() => {
    const query = router.query;
    if (Object.keys(query).length > 0) {
      setSearchQuery(query);
      filterPosts(query);
    }
  }, []);

  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    setPaginatedPosts(currentPosts);
  }, [currentPage, filteredPosts]);

  const filterPosts = (params) => {
    const { title, category } = params;
    const query = {};

    if (title) query.title = encodeURIComponent(title);
    if (category) query.category = encodeURIComponent(category);

    router.push({
      pathname: "",
      query,
    });

    const queryString = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join("&");

    fetch(`/api/posts?${queryString}`)
      .then((response) => response.json())
      .then((data) => setFilteredPosts(data), setCurrentPage(1))
      .catch((error) => console.error("Error fetching filtered posts:", error));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = {};

    if (e.target.category.value.length > 0) {
      query.category = e.target.category.value;
    }
    if (e.target.search.value.length > 0) {
      query.title = e.target.search.value;
    }

    if (query) {
      filterPosts(query);
    }
  };

  return (
    <div>
      <div className="container mx-auto py-3 px-40">
        <h1 className="text-4xl font-extrabold text-left mb-6">
          Emersoft Blog
        </h1>
        <form className="flex py-5" onSubmit={handleSearchSubmit}>
          <input
            placeholder={
              searchQuery.title ? searchQuery.title : "Search blog post"
            }
            className="px-1 py-1 mr-4"
            name="search"
          />
          <div className="relative inline-block text-left mr-4">
            <select
              name="category"
              defaultValue={
                router.query.category && router.query.category.toLowerCase()
              }
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md leading-tight focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => {
                const { slug = "", name = "", id = "" } = category;
                return (
                  <option value={slug} key={id}>
                    {name}
                  </option>
                );
              })}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            className="mr-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
          >
            Search
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded focus:outline-none"
            onClick={clearSearch}
          >
            Clear
          </button>
        </form>
      </div>
      <div className="container mx-auto py-8">
        <div className="mx-40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-col-4 gap-6">
          {paginatedPosts &&
            paginatedPosts.map((post, index) => {
              return <Card data={post} key={index} />;
            })}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        postsPerPage={postsPerPage}
        filteredPosts={filteredPosts}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/posts");
  const posts = await res.json();

  return {
    props: { posts },
  };
}
