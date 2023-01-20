import { Link } from "react-router-dom";

import "./BlogPostsList.scss";

import { useBLogPostsListData } from "../utils/utils";
import { TeaserPost } from "../components";

export const BlogPostsList = () => {
  const posts = useBLogPostsListData();

  const renderNoMatchResults = () => (
    <h1 className="no-match-post">
      Ooops!<br/>
      <span>No post match with this search.</span>
    </h1>
  );

  const renderNoMoreResults = () => (
    <p className="no-more-results">No more results</p>
  );

  return (
    <section className="blog-posts-list">
      <Link className="add-post" to="/blog/new">Add post</Link>
      {!posts.length && renderNoMatchResults()}
      {posts.map(post => <TeaserPost post={post} key={post.id} />)}
      {posts.length > 0 && renderNoMoreResults()}
    </section>
  );
};
