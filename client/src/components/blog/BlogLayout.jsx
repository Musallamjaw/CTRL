import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const BlogLayout = ({
  children,
  title,
  description,
  createdAt,
  readingTime = "5 min read",
  blogType,
  isLoading = false,
}) => {
  // Format date if provided
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  // Define badge color classes based on blog type
  const getBadgeStyles = () => {
    switch (blogType) {
      case "content":
        return "bg-purple-100 text-purple-800";
      case "file":
        return "bg-blue-100 text-blue-800";
      case "images":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded w-full mb-8"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to all blogs
      </Link>

      {/* Blog header */}
      <header className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div
            className={`px-2 py-1 text-xs font-medium rounded ${getBadgeStyles()}`}
          >
            {blogType.charAt(0).toUpperCase() + blogType.slice(1)} Blog
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            {formattedDate}
          </div>

          <div className="text-sm text-gray-500 flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {readingTime}
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-xl text-gray-600">{description}</p>
      </header>

      {/* Blog content */}
      <main className="prose prose-lg max-w-none">{children}</main>
    </div>
  );
};
BlogLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  readingTime: PropTypes.string,
  blogType: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default BlogLayout;
