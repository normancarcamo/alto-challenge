import { Link } from "react-router-dom";

import "./TeaserPost.scss";

import { parseDate } from "../utils/utils";

import type { IPost } from "../utils/types";

type TeaserPostProps = {
  post: IPost
  className?: string
};

export const TeaserPost = (props: TeaserPostProps) => {
  if (!props.post) {
    return null;
  }

  const createdAt = parseDate(props.post.createdAt);

  return (
    <Link 
      to={`/blog/${props.post.slug}`} 
      state={{ post: props.post }} 
      className={`post ${props.className ?? ""}`.trim()} 
    >
      <article>
        {props.post.cover && <img src={props.post.cover} />}
        <h1>{props.post.title}</h1>
        <h2>{props.post.createdBy}</h2>
        <h3>{createdAt}</h3>
      </article>
    </Link>
  );
};
