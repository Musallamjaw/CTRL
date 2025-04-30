import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FileText, Image, File, Calendar, Clock } from "lucide-react";

const UIBlogCard = ({ blog }) => {
  // Format createdAt date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // --- Helper to get type-specific details ---
  const getTypeDetails = () => {
    switch (blog.blogType) {
      case "content":
        return {
          icon: <FileText className="h-5 w-5" />,
          badgeText: "Article", // Using "Article" instead of "Content" for clarity
          badgeColor: "bg-purple-100 text-purple-800",
          placeholderIcon: <FileText className="h-12 w-12 text-gray-400" />,
        };
      case "file":
        return {
          icon: <File className="h-5 w-5" />,
          badgeText: "File",
          badgeColor: "bg-blue-100 text-blue-800",
          placeholderIcon: <File className="h-12 w-12 text-gray-400" />,
        };
      case "images":
        return {
          icon: <Image className="h-5 w-5" />,
          badgeText: "Gallery", // Using "Gallery" for image collections
          badgeColor: "bg-green-100 text-green-800",
          placeholderIcon: <Image className="h-12 w-12 text-gray-400" />,
        };
      default:
        return {
          icon: <FileText className="h-5 w-5" />,
          badgeText: "Blog",
          badgeColor: "bg-gray-100 text-gray-800",
          placeholderIcon: <FileText className="h-12 w-12 text-gray-400" />,
        };
    }
  };

  const { icon, badgeText, badgeColor, placeholderIcon } = getTypeDetails();

  // --- Render Thumbnail based on blog type ---
  const renderThumbnail = () => {
    // Prioritize images if available, regardless of specific type
    // (e.g., a 'content' blog might still have a primary image)
    // Adjust this logic if a featuredImage field exists or if only 'images' type should show images.
    // For now, let's assume only 'images' type uses the blog.images array for the thumbnail.
    if (blog.blogType === "images" && blog.images?.length > 0) {
      // Use the first image as the thumbnail
      // Ensure the URL is correct (absolute or relative to your backend)
      const imageUrl = blog.images[0].url; // Assuming .url holds the path/URL
      return (
        <img
          src={imageUrl} // Consider adding backend URL prefix if needed: `http://yourbackend.com${imageUrl}`
          alt={blog.title || "Blog image"}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            // Optional: Fallback if image fails to load
            e.target.style.display = "none"; // Hide broken image
            // You could show the placeholder icon here instead, but it requires restructuring
          }}
        />
      );
    }

    // If no image for 'images' type, or for other types, show placeholder
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
        {placeholderIcon}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out overflow-hidden border border-gray-200 flex flex-col">
      {/* Thumbnail Area */}
      <Link to={`/blog/${blog._id}`} className="block flex-shrink-0">
        {renderThumbnail()}
      </Link>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Badge and Date/Read Time */}
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}
          >
            {icon}
            <span className="ml-1.5">{badgeText}</span>
          </div>
          <div className="flex items-center">
            {/* Example Read Time - replace with actual if available */}
            <Clock className="h-3 w-3 mr-1" />5 min read
          </div>
        </div>

        {/* Title */}
        <Link to={`/blog/${blog._id}`} className="block mt-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-purple-700 transition-colors">
            {blog.title || "Untitled Blog Post"} {/* Fallback Title */}
          </h3>
        </Link>

        {/* Description */}
        {blog.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {blog.description}
          </p>
        )}

        {/* Footer - Date */}
        <div className="mt-auto pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1.5" />
            Published on {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
};

UIBlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    // Allow any string for blogType initially, or refine further if needed
    blogType: PropTypes.string,
    content: PropTypes.string, // Keep for potential use
    file: PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired, // Ensure URL is required if the object exists
      })
    ),
    createdAt: PropTypes.string.isRequired, // Make createdAt required
    published: PropTypes.bool, // Keep for potential use
  }).isRequired,
  // onPublishToggle is removed as it wasn't used in the provided snippet for this card
};

export default UIBlogCard;
