import type { IMessage, IPost, ISearchResult } from "./types";

import { useLocalStorage } from "./utils";

const sleep = (ms = 1500): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

const findBySlugDecoded = (slug = "") => (post?: IPost) => {
  return decodeURIComponent(post?.slug ?? "") === slug;
};

// files: src/utils/utils.ts (useBLogPostsListData)
// files: src/layouts/Header.tsx (onKeyUp)
export const searchPosts = async (keyword?: string | null, limit?: number): Promise<ISearchResult> => {
  try {
    const text = (keyword ?? "").toString().toLowerCase().trim();
    if (text) {
      const blog = useLocalStorage();
      const results = blog.posts
        .filter((post) => post.title.toLowerCase().includes(text));
      if (limit) {
        return {
          total: results.length,
          posts: results.filter((_, index) => index < limit),
        };
      } else {
        return { total: 0, posts: results };
      }
    } else {
      return { total: 0, posts: [] };
    }
  } catch (error) {
    console.error(error);
    const message = (error as Error).message ?? "Error when searhing posts";
    return { total: 0, posts: [], error: message };
  }
};

// files: src/utils/utils.ts (useBlogPostData)
export const fetchPostBySlug = async (slug?: string): Promise<IPost> => {
  await sleep(500);
  const blog = useLocalStorage();
  const result = blog.posts.find(findBySlugDecoded(slug));
  if (!result) {
    throw new Error("Blog post not found");
  }
  return result;
};

// files: src/pages/ContactForm.tsx
export const submitContactForm = async (formData: IMessage): Promise<void> => {
  await sleep(500);

  if (formData.name === "unknown") {
    throw new Error("Error when submitting the form");
  }

  const blog = useLocalStorage();
  blog.messages.push(formData);
  localStorage.setItem("blog", JSON.stringify(blog));
  console.info("Contact form successfully submitted!");
};

// files: src/pages/BlogPostFrom.tsx
export const submitNewPostForm = async (data: IPost): Promise<void> => {
  const blog = useLocalStorage();

  await sleep(500);

  const result = blog.posts.find(findBySlugDecoded(data.slug));

  if (result || data.title === "new") {
    throw new Error("Blog post already exists with this title");
  }

  blog.posts.push(data);
  localStorage.setItem("blog", JSON.stringify(blog));
  console.info("Post added successfully");
};

// files: src/pages/BlogPostFrom.tsx
export const submitEditPostForm = async (data: IPost): Promise<void> => {
  const blog = useLocalStorage();

  await sleep(500);

  if (data.title === "new") {
    throw new Error("Blog post already exists with this title");
  }

  const index = blog.posts.findIndex(post => post.id === data.id);
  const post = blog.posts[index];

  if (index >= 0 && post.id !== data.id) {
    throw new Error("Blog post already exists with this title");
  }

  blog.posts[index] = data;
  localStorage.setItem("blog", JSON.stringify(blog));
  console.info("Post updated successfully");
};
