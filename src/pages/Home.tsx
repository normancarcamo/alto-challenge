import { TeaserPost } from "../components";

import "./Home.scss";

import { useHomeData } from "../utils/utils";

import type { IHero, IPost } from "../utils/types";

const Hero = (props: { data?: IHero }) => {
  if (!props.data?.image) {
    return null;
  }

  return (
    <figure className="hero">
      <img alt="Hero image" src={props.data.image} />
      <figcaption className="info">
        <h3>{props.data.title}</h3>
        <p>{props.data.description}</p>
      </figcaption>
    </figure>
  );
};

const Description = (props: { text?: string }) => {
  if (!props.text) {
    return null;
  }

  return (
    <p className="description">
      {props.text}
    </p>
  );
};

const Video = (props: { url?: string }) => {
  if (!props.url) {
    return null;
  }

  return (
    <article className="video">
      <iframe
        src={props.url}
        allow="accelerometer; autoplay; encrypted-media; gyroscope;"
        allowFullScreen
      />
    </article>
  );
};

const SubPosts = (props: { posts: IPost[] }) => {
  if (!props.posts?.length) {
    return null;
  }

  return (
    <div className={`subposts subposts-${props.posts.length}`}>
      {props.posts.map((post, index) => (
        <TeaserPost 
          key={post.slug} 
          post={post} 
          className={`post item-${index + 1}`} 
        />
      ))}
    </div>
  );
};

const OldPosts = (props: { posts: IPost[] }) => {
  if (!props.posts?.length) {
    return null;
  }

  return (
    <>
      {props.posts.map(post => <TeaserPost key={post.slug} post={post} />)}
    </>
  );
};

export const Home = () => {
  const data = useHomeData();
  return (
    <section className="home">
      <Hero data={data.hero} />
      <div className={data.contentStyles}>
        <Description text={data.text} />
        <Video url={data.video} />
        <TeaserPost post={data.topPost} className="post-top" />
        <SubPosts posts={data.subPosts} />
        <OldPosts posts={data.oldPosts} />
      </div>
    </section>
  );
};
