import { useState, useEffect, useCallback } from "react";
// Assuming your API file structure and export:
import { getAllBlogs } from "../api/endpoints/blogs"; // Adjust path as needed
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; // For showing errors nicely
import BlogCard from "../components/molecule/BlogCard";
// Default filter (adjust based on your backend capabilities)
const DEFAULT_FILTER = "latest";
const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- State for Pagination and Filtering ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Get this from API response
  const [filter, setFilter] = useState(DEFAULT_FILTER); // e.g., 'latest', 'popular', 'title-asc'
  const [selectedBlogType, setSelectedBlogType] = useState("all"); // null means 'all types'
  // --- Fetch Blogs Function ---
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Call the updated API function
      const response = await getAllBlogs(currentPage, selectedBlogType, filter);
      console.log("API Response:", response.data); // Log the raw response

      // --- IMPORTANT: Adapt response handling to YOUR API structure ---
      // Assuming axiosInstance returns the response object, and your backend sends data like:
      // { success: true, data: { blogs: [...], totalPages: X, currentPage: Y } }
      if (response && response.data && response.data.success) {
        setBlogs(response.data.data || []); // Adjust path 'data.data.blogs' if needed
        setTotalPages(response.data.data?.totalPages || 1); // Adjust path if needed
        // Optionally update currentPage if API confirms it: setCurrentPage(response.data.data?.currentPage || currentPage);
      } else {
        // Handle cases where response structure is unexpected or success is false
        throw new Error(
          response?.data?.message ||
            "Failed to fetch blogs. Unexpected response format."
        );
      }
      // --- End of API structure adaptation ---
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      const errorMessage =
        err.response?.data?.message || // Check Axios error response
        err.message ||
        "Failed to load blog posts. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage); // Show toast notification for error
      setBlogs([]); // Clear blogs on error
      setTotalPages(1); // Reset pages
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter, selectedBlogType]); // Dependencies for useCallback
  // --- useEffect to Fetch Data on Change ---
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]); // fetchBlogs is memoized by useCallback, so this runs when its dependencies change
  // --- Handlers for Pagination and Filters ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };
  const handleBlogTypeChange = (event) => {
    const value = event.target.value;
    setSelectedBlogType(value); // Set null for 'all' option
    setCurrentPage(1); // Reset to page 1 when type filter changes
  };
  return (
    <div className="lg:col-span-3 w-full mx-auto lg:ml-6 bg-white rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
        <Link
          to="/admin/addBlog" // Adjust link
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
        >
          Add New Blog
        </Link>
      </div>
      {/* --- Filter Controls --- */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        {/* Blog Type Filter */}
        <div>
          <label
            htmlFor="blogTypeFilter"
            className="text-sm font-medium text-gray-700 mr-2"
          >
            Type:
          </label>
          <select
            id="blogTypeFilter"
            value={selectedBlogType || "all"} // Default to 'all' if null
            onChange={handleBlogTypeChange}
            className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="content">Content</option>
            <option value="file">File</option>
            <option value="images">Images</option>
          </select>
        </div>
      </div>

      {/* --- Loading State --- */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">Loading blog posts...</p>
          {/* Optional: Spinner component */}
        </div>
      )}

      {/* --- Error State --- */}
      {error &&
        !loading && ( // Only show error if not loading
          <div
            className="text-center py-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

      {/* --- No Data State --- */}
      {!loading && !error && blogs.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">
            No blog posts found matching your criteria.
          </p>
        </div>
      )}

      {/* --- Blog Grid --- */}
      {!loading && !error && blogs.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default BlogList;
