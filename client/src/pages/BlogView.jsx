import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBlogById } from "../api/endpoints/blogs";
import ContentBlog from "../components/blog/ContentBlog";
import FileBlog from "../components/blog/FileBlog";
import ImagesBlog from "../components/blog/ImagesBlog";

const BlogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);
        const response = await getBlogById(id);

        if (response?.data?.success) {
          setBlog(response.data.data);
        } else {
          throw new Error("Failed to fetch blog details");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to load blog";
        setError(errorMessage);

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const renderBlogContent = () => {
    if (isLoading) {
      return null; // or a loading component/spinner if you want
    }

    if (error) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-8">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Blog List
          </button>
        </div>
      );
    }

    if (!blog) {
      return (
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Blog Not Found
          </h2>
          <p className="text-gray-700 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Blog List
          </button>
        </div>
      );
    }

    switch (blog.blogType) {
      case "content":
        return <ContentBlog blog={blog} isLoading={isLoading} />;
      case "file":
        return <FileBlog blog={blog} isLoading={isLoading} />;
      case "images":
        return <ImagesBlog blog={blog} isLoading={isLoading} />;
      default:
        return <ContentBlog blog={blog} isLoading={isLoading} />;
    }
  };

  return renderBlogContent();
};

export default BlogView;
