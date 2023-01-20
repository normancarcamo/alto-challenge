import { Link, useLocation, useParams } from "react-router-dom";

import "./BlogPostDetails.scss";

import { Loader } from "../components";
import { useBlogPostData, parseDate } from "../utils/utils";
import { NotFound } from "./NotFound";

export const BlogPostDetails = () => {
  const location = useLocation();
  const { slug: slugURL } = useParams();
  const { post, isLoading } = useBlogPostData(location.state?.post, slugURL);

  if (!post && !isLoading) {
    return <NotFound />;
  }

  const title = post?.title ?? "";
  const createdBy = post?.createdBy ?? "";
  const createdAt = parseDate(post?.createdAt);
  const cover = post?.cover ?? "";
  const body = post?.body ?? "";
  const slug = post?.slug ?? "";
  
  const renderCover = () => (
    <img 
      className="cover" 
      src={cover} 
      title={title} 
      alt="Failed to load the image"
    />
  );

  return (
    <section className="blog-post-details">
      <Loader isProcessing={isLoading}>
        <h1 className="title">{title}</h1>
        <div className="createdBy">
          <em>written by</em>
          <p>{createdBy}</p>
        </div>
        <div className="createdAt">
          <em>posted on</em>
          <p>{createdAt}</p>
        </div>
        {cover && renderCover()}
        <div className="body" dangerouslySetInnerHTML={{ __html: body }} />
        <Link className="edit" to={`/blog/${slug}/edit`} state={{ post }} >
          Edit post
        </Link>
      </Loader>
    </section>
  );
};
