import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FileText,
  Image as ImageIcon,
  File,
  // Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  // ChevronLeft,
  // ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";

const ClientBlogCard = ({ blog }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getTypeDetails = () => {
    switch (blog.blogType) {
      case "content":
        return {
          icon: <FileText className="h-5 w-5" />,
          badgeColor: "bg-purple-100 text-purple-800",
        };
      case "file":
        return {
          icon: <File className="h-5 w-5" />,
          badgeColor: "bg-blue-100 text-blue-800",
        };
      case "images":
        return {
          icon: <ImageIcon className="h-5 w-5" />,
          badgeColor: "bg-green-100 text-green-800",
        };
      default:
        return {
          icon: <FileText className="h-5 w-5" />,
          badgeColor: "bg-gray-100 text-gray-800",
        };
    }
  };
  const [isPaused, setIsPaused] = useState(false);

  const visibleCount = 3;

  useEffect(() => {
    const maxIndex = blog.images.length - visibleCount;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex >= maxIndex ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [blog.images.length]);

  const { icon, badgeColor } = getTypeDetails();

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % blog.images.length);
  };

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? blog.images.length - 1 : prev - 1));
  };

  const renderContentBlog = () => {
    if (!blog.content) return null;
    const words = blog.content.split(" ");
    const preview = words.slice(0, 100).join(" ");
    const hasMore = words.length > 100;

    return (
      <>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: showFullContent
              ? blog.content
              : preview + (hasMore ? "..." : ""),
          }}
        />
        {hasMore && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-4"
          >
            {showFullContent ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {showFullContent ? "Show Less" : "Show More"}
          </button>
        )}
      </>
    );
  };

  const renderFileBlog = () => {
    if (!blog.files || blog.files.length === 0) return null;

    return blog.files.map((filePath, index) => {
      const fileName = filePath.split("/").pop();
      const fileType = fileName.split(".").pop();
      return (
        <div
          key={index}
          className="bg-gray-50 border border-gray-200 rounded-lg p-2 my-6 flex flex-col items-center w-full"
        >
          <File className="h-12 w-12 text-blue-600" />
          <h3 className="text-lg font-medium mt-4 mb-2">{fileName}</h3>
          <p className="text-sm text-gray-500 mb-6">{fileType.toUpperCase()}</p>
          <a
            href={`https://api.ctrl-club.com${filePath}`}
            download
            className="inline-flex items-center bg-base-color text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </a>
        </div>
      );
    });
  };

  const renderImagesBlog = () => {
    if (!blog.images || blog.images.length === 0) return null;

    const isSquare = blog?.imageSize === "square";
    const imageWidth = isSquare ? 300 : 470; // Increase image width for 16:9 images
    const imageHeight = isSquare ? 300 : (imageWidth * 9) / 16; // Maintain 16:9 aspect ratio for height

    return (
      <div className="w-full overflow-hidden my-8 relative">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            width: `${blog.images.length * imageWidth}px`, // Adjust width of carousel based on images
            transform: `translateX(-${activeIndex * imageWidth}px)`, // Adjust translation for proper scrolling
          }}
        >
          {blog.images.map((image, index) => (
            <div
              key={index}
              className="flex-none px-2"
              style={{
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
              }}
            >
              <img
                src={`https://api.ctrl-club.com${image}`}
                alt={`Slide ${index}`}
                className={`w-full h-full object-cover rounded-lg bg-gray-100 ${
                  isSquare ? "aspect-square" : ""
                }`}
              />
            </div>
          ))}
        </div>
        {/* <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={handlePrevious}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={handleNext}
            className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div> */}
      </div>
    );
  };

  const renderLinkBlog = () => {
    if (!blog.link) return null;

    const linkText = blog.link.split("/").pop(); // You can customize how you want to show the link's text

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 my-6 flex flex-col items-center w-full">
        <h3 className="text-lg font-medium mt-4 mb-2">{linkText}</h3>
        <p className="text-sm text-gray-500 mb-6">External Link</p>
        <a
          href={blog.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-base-color text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          <ExternalLink className="mr-2 h-4 w-4" />{" "}
          {/* Use an icon for external link */}
          Open Link
        </a>
      </div>
    );
  };

  const renderBlogContent = () => {
    switch (blog.blogType) {
      case "content":
        return renderContentBlog();
      case "file":
        return renderFileBlog();
      case "images":
        return renderImagesBlog();
      case "link":
        return renderLinkBlog();
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 w-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}
          >
            {icon}
            <span className="ml-1 capitalize">{blog.blogType}</span>
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            {formattedDate}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {blog.title}
        </h3>
        <p className="text-gray-600 mb-6">{blog.description}</p>
        {renderBlogContent()}
      </div>
    </div>
  );
};

ClientBlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    blogType: PropTypes.oneOf(["content", "file", "images"]).isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
    imageSize: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ClientBlogCard;
