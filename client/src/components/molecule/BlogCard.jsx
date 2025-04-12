import PropTypes from "prop-types"; // Import PropTypes for validation
import { IoMdDocument, IoMdTime } from "react-icons/io"; // Added Time icon
import { formatDistanceToNow } from "date-fns"; // For user-friendly dates

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  }
  return text.substr(0, maxLength) + "...";
};

const BlogCard = ({ blog }) => {
  if (!blog) return null; // Handle case where blog data might be missing

  const {
    _id,
    title,
    description,
    blogType,
    content,
    files,
    images,
    createdAt,
  } = blog;

  const renderCardContent = () => {
    switch (blogType) {
      case "content":
        return (
          <div className="mt-3 text-gray-600 text-sm">
            <p>{truncateText(content, 150)}</p>
            {/* Optional: Link to full blog post page */}
            <a
              href={`/blogs/${_id}`}
              className="text-indigo-600 hover:underline mt-2 inline-block"
            >
              Read More
            </a>
          </div>
        );
      case "file":
        return (
          <div className="mt-3">
            {files && (
              <a
                href={`https://api.ctrl-club.com${files}`} // Use the URL from your API response
                target="_blank" // Open in new tab
                rel="noopener noreferrer" // Security best practice
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition duration-150 ease-in-out text-sm"
              >
                <IoMdDocument className="text-lg" />
                <span>{"Download File"}</span> {/* Display filename */}
              </a>
            )}
            {!files && (
              <p className="text-sm text-red-500">File data missing.</p>
            )}
          </div>
        );
      case "images":
        return (
          <div className="mt-3">
            {images && images.length > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {/* Show first few images as thumbnails */}
                  {images.slice(0, 3).map((img, index) => (
                    <img
                      key={index}
                      src={`https://api.ctrl-club.com${img}`} // Use the image URL from your API response
                      alt={`Blog image ${index + 1}`}
                      className="w-full h-16 object-cover rounded border border-gray-200"
                      loading="lazy" // Lazy load images
                    />
                  ))}
                  {images.length > 3 && (
                    <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm font-medium">
                      +{images.length - 3} more
                    </div>
                  )}
                </div>
                {/* Optional: Link to a gallery view or the full post */}
                <a
                  href={`/blogs/${_id}`}
                  className="text-indigo-600 hover:underline mt-2 inline-block text-sm"
                >
                  View Gallery ({images.length} image
                  {images.length > 1 ? "s" : ""})
                </a>
              </>
            ) : (
              <p className="text-sm text-gray-500">No images found.</p>
            )}
          </div>
        );
      default:
        return <p className="text-sm text-red-500 mt-3">Unknown blog type.</p>;
    }
  };

  // Determine type badge style
  const getTypeBadge = () => {
    switch (blogType) {
      case "content":
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
            Content
          </span>
        );
      case "file":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-400">
            File
          </span>
        );
      case "images":
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded border border-purple-400">
            Images
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between p-5 hover:shadow-md transition-shadow duration-200">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
          {getTypeBadge()}
        </div>

        <p className="text-gray-600 text-sm mb-3">{description}</p>

        {/* Render type-specific content */}
        {renderCardContent()}
      </div>

      {/* Footer with date */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <IoMdTime />
          <span>
            {createdAt
              ? `${formatDistanceToNow(new Date(createdAt))} ago`
              : "Date unavailable"}
          </span>
        </div>
        {/* Add Edit/Delete buttons here if needed */}
        {/* <div className="flex gap-2">
            <button className="text-blue-600 hover:underline">Edit</button>
            <button className="text-red-600 hover:underline">Delete</button>
         </div> */}
      </div>
    </div>
  );
};
BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    blogType: PropTypes.string,
    content: PropTypes.string,
    file: PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    createdAt: PropTypes.string,
  }),
};

export default BlogCard;
