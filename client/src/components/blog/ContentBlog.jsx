import PropTypes from "prop-types";
import BlogLayout from "./BlogLayout";

const ContentBlog = ({ blog, isLoading }) => {
  return (
    <BlogLayout
      title={blog?.title || ""}
      description={blog?.description || ""}
      createdAt={blog?.createdAt}
      blogType="content"
      isLoading={isLoading}
    >
      <div
        className="content-blog"
        dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
      />
    </BlogLayout>
  );
};
ContentBlog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    content: PropTypes.string,
  }),
  isLoading: PropTypes.bool.isRequired,
};

export default ContentBlog;
