import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  FileText,
  Image as ImageIcon,
  File,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ClientBlogCard = ({ blog }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
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
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6 flex flex-col items-center w-full"
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

  const [previewImage, setPreviewImage] = useState(null);

  // Image preview modal
  const renderImagePreviewModal = () => {
    if (!previewImage) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={() => setPreviewImage(null)}
      >
        <div
          className="relative max-w-full max-h-full p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-2 right-2 text-white bg-gray-800 p-1 rounded-full hover:bg-red-600"
          >
            ✕
          </button>
          <img
            src={`https://api.ctrl-club.com${previewImage}`}
            alt="Preview"
            className="max-h-[70vh] max-w-[80vw] object-contain rounded-lg"
          />
        </div>
      </div>
    );
  };

  const renderImagesBlog = () => {
    if (!blog.images || blog.images.length === 0) return null;

    const isSquare = blog?.imageSize === "square";

    const getImagesPerView = () => {
      if (isMobile) return 1;
      if (isTablet) return isSquare ? 2 : 1;
      return isSquare ? 3 : 2;
    };

    const imagesPerView = getImagesPerView();
    const totalSlides = Math.ceil(blog.images.length / imagesPerView);
    const startIndex = activeIndex * imagesPerView;
    const visibleImages = blog.images.slice(
      startIndex,
      startIndex + imagesPerView
    );

    const handleNext = () => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    };

    const handlePrevious = () => {
      setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    useEffect(() => {
      const interval = setInterval(() => {
        handleNext();
      }, 4000);
      return () => clearInterval(interval);
    }, [imagesPerView, totalSlides]);

    return (
      <>
        <div className="relative w-full my-8 group">
          <div className="flex overflow-hidden w-full">
            {visibleImages.map((image, index) => (
              <div
                key={index}
                onClick={() => setPreviewImage(image)}
                className="flex-1 px-2 cursor-pointer"
                style={{ flexBasis: `${100 / imagesPerView}%` }}
              >
                <img
                  src={`https://api.ctrl-club.com${image}`}
                  alt={`Slide ${index}`}
                  className="w-full h-[320px] sm:h-[360px] md:h-[420px] object-cover rounded-md"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handlePrevious}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-70 hover:opacity-100"
          >
            <ChevronRight />
          </button>
        </div>
        {renderImagePreviewModal()}
      </>
    );
  };

  const renderLinkBlog = () => {
    if (!blog.link) return null;

    const linkText = blog.link.split("/").pop();

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-6 flex flex-col items-center w-full">
        <h3 className="text-lg font-medium mt-4 mb-2">{linkText}</h3>
        <p className="text-sm text-gray-500 mb-6">External Link</p>
        <a
          href={blog.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-base-color text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
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

  const { icon, badgeColor } = getTypeDetails();

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
    blogType: PropTypes.oneOf(["content", "file", "images", "link"]).isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string,
    files: PropTypes.arrayOf(PropTypes.string),
    link: PropTypes.string,
    imageSize: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ClientBlogCard;
