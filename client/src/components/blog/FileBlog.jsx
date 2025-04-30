import PropTypes from "prop-types";
import { Download, File } from "lucide-react";
import BlogLayout from "./BlogLayout";

const FileBlog = ({ blog, isLoading }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${kb.toFixed(2)} KB`;
    }
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <File className="h-12 w-12 text-blue-600" />;

    if (fileType.includes("pdf")) {
      return <File className="h-12 w-12 text-red-600" />;
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <File className="h-12 w-12 text-blue-600" />;
    } else if (
      fileType.includes("sheet") ||
      fileType.includes("excel") ||
      fileType.includes("csv")
    ) {
      return <File className="h-12 w-12 text-green-600" />;
    } else if (fileType.includes("zip") || fileType.includes("rar")) {
      return <File className="h-12 w-12 text-purple-600" />;
    }

    return <File className="h-12 w-12 text-gray-600" />;
  };

  return (
    <BlogLayout
      title={blog?.title || ""}
      description={blog?.description || ""}
      createdAt={blog?.createdAt}
      blogType="file"
      isLoading={isLoading}
    >
      <div className="file-blog">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 my-8 flex flex-col items-center">
          {getFileIcon(blog?.file?.type)}

          <h3 className="text-lg font-medium mt-4 mb-2">
            {blog?.file?.name || "Download File"}
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            {formatFileSize(blog?.file?.size)} •{" "}
            {blog?.file?.type || "Unknown type"}
          </p>

          <a
            href={blog?.file?.url}
            download
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </a>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About this file</h2>
          <p>{blog?.description}</p>
        </div>
      </div>
    </BlogLayout>
  );
};
FileBlog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    file: PropTypes.shape({
      name: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  isLoading: PropTypes.bool,
};

export default FileBlog;
