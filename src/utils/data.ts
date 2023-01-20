import type { IBlog } from "./types";

import blog from "../assets/blog.json";

export const blogData = blog;

export const blogEmpty: IBlog = {
  company: {
    logo: "",
    hero: {
      image: "",
      title: "",
      description: ""
    },
    information: "",
    video: ""
  },
  posts: [],
  messages: [],
};

export const blogPostEmpty = {
  "id": "",
  "title": "",
  "intro": "",
  "cover": "",
  "createdBy": "",
  "body": "",
  "conclusion": "",
  "createdAt": "",
  "slug": "",
};
