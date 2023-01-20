import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import type { IBlog, IPost, } from "./types";

import { blogEmpty } from "./data";
import * as service from "./service";

export const debounceFactory = () => {
  let timeOutId = 0;
  return (ms: number, callback: () => void): void => {
    clearTimeout(timeOutId);
    timeOutId = setTimeout(() => {
      if (callback) {
        callback();
      }
    }, ms);
  };
};

export const debounce = debounceFactory();

export const genId = (): string => {
  return Math.random().toString(36).slice(-6);
};

export const genSlug = (title: string): string => {
  return encodeURIComponent(
    title.toString().toLowerCase().replaceAll(/\ +/gim, "-")
  );
};

export const loadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = function() {
      const src = (this as HTMLImageElement).src;
      resolve(src);
    };
    image.onerror = () => {
      reject(new Error("Image could not be loaded"));
    };
  });
};

export const hydrateLocalStorage = () => {
  if (!localStorage.getItem("blog")) {
    import("../assets/blog.json").then((data) => {
      console.info("Hydrating localStorage with .json file...");
      const blog: IBlog = { ...data };
      if (!blog?.company) {
        blog.company = blogEmpty.company;
      }
      if (!blog?.company?.hero) {
        blog.company.hero = blogEmpty.company.hero;
      }
      if (!blog.messages) {
        blog.messages = blogEmpty.messages;
      }
      if (!blog.posts) {
        blog.posts = blogEmpty.posts;
      }
      localStorage.setItem("blog", JSON.stringify(blog));
    }).catch((error) => {
      console.info("Error when trying to hydrate data.");
      console.error(error);
      console.info("Using default values for localStorage...");
      localStorage.setItem("blog", JSON.stringify(blogEmpty));
    }).finally(() => {
      console.info("localStorage hydrated.");
      console.info("Reloading page...");
      setTimeout(() => location.reload(), 1000);
    });
  }
};

export const useLocalStorage = () => {
  const item = localStorage.getItem("blog") ?? "null";
  const blog = (JSON.parse(item) ?? blogEmpty) as IBlog;
  return blog;
};

// -------------------- HOOKS:

export const useHomeData = () => {
  const blog = useLocalStorage();
  const logo = blog.company.logo;
  const text = blog.company.information;
  const video = blog.company.video;
  const hero = blog.company.hero;
  const [topPost, ...posts] = sortBlogPostsByDate(blog.posts) as IPost[] ?? [];
  const subPosts = posts.filter((_, index) => index < 6);
  const oldPosts = posts.filter((_, index) => index >= 6 && index < 11);
  const contentStyles = "content " + [
    text ? "with-text" : "",
    video ? "with-video" : "",
    topPost ? "with-post" : "",
  ].join(" ");
  return {
    logo,
    text,
    video,
    hero,
    topPost,
    subPosts,
    oldPosts,
    contentStyles,
  };
};

export const useBlogPostData = (postFromLocationState: IPost, slug?: string) => {
  const [post, setPost] = useState<IPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (postFromLocationState) {
      setPost(postFromLocationState);
    } else if (slug) {
      setIsLoading(true);
      service.fetchPostBySlug(slug)
        .then((res) => setPost(res))
        .catch(() => setPost(null))
        .finally(() => setIsLoading(false));
    } else {
      setPost(null);
      setIsLoading(false);
    }
  }, [slug]);

  return { post, setPost, isLoading, setIsLoading };
};

export const sortBlogPostsByDate = (posts: IPost[] = []): IPost[] => {
  posts.sort((a, b) => {
    const dateA = new Date(a.createdAt ?? "").getTime();
    const dateB = new Date(b.createdAt ?? "").getTime();
    return dateA - dateB;
  }).reverse();
  return posts;
};

export const useBLogPostsListData = (): IPost[] => {
  const blog = useLocalStorage();
  const [posts, setBlogPosts] = useState<IPost[]>(blog.posts);
  const [urlSearchParams] = useSearchParams();
  const slug = urlSearchParams.get("slug");

  useEffect(() => {
    if (slug) {
      service.searchPosts(slug)
        .then((result) => setBlogPosts(result.posts))
        .catch(() => setBlogPosts([]));
    } else {
      setBlogPosts(blog.posts);
    }
  }, [slug]);

  return sortBlogPostsByDate(posts);
};

export const parseDate = (dateISO?: string): typeof dateISO => {
  if (!dateISO) return dateISO;
  const date = new Date(dateISO);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
