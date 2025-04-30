import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Image } from "lucide-react";
import BlogLayout from "./BlogLayout";

const ImagesBlog = ({ blog, isLoading }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? blog.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === blog.images.length - 1 ? 0 : prev + 1));
  };

  if (!blog?.images?.length && !isLoading) {
    return (
      <BlogLayout
        title={blog?.title || ""}
        description={blog?.description || ""}
        createdAt={blog?.createdAt}
        blogType="images"
        isLoading={isLoading}
      >
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Image className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500">No images available for this post.</p>
        </div>
      </BlogLayout>
    );
  }

  return (
    <BlogLayout
      title={blog?.title || ""}
      description={blog?.description || ""}
      createdAt={blog?.createdAt}
      blogType="images"
      isLoading={isLoading}
    >
      {/* Image Carousel */}
      <div className="relative my-8">
        <div className="overflow-hidden rounded-lg">
          {blog?.images?.map((image, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 ${
                index === activeIndex ? "block" : "hidden"
              }`}
            >
              <img
                src={`https://api.ctrl-club.com${image}`}
                alt={image.alt || `Image ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {activeIndex + 1} / {blog?.images?.length}
        </div>
      </div>

      {/* Thumbnails */}
      {blog?.images?.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {blog.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-purple-500 opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={`https://api.ctrl-club.com${image}`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="mt-8 prose">
        <p>{blog?.description}</p>
      </div>
    </BlogLayout>
  );
};

ImagesBlog.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        alt: PropTypes.string,
      })
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    blogType: PropTypes.oneOf(["images"]).isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ImagesBlog;
