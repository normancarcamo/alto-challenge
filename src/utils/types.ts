// files: src/pages/Home.tsx
// files: src/utils/types.tsx
export interface IHero {
  image?: string
  title?: string
  description?: string
};

// files: src/utils/utils.ts
// files: src/utils/types.ts
// files: src/utils/service.ts
// files: src/components/TeaserPost.tsx
// files: src/pages/BlogPostForm.tsx
// files: src/pages/Home.tsx
export interface IPost {
  id?: string
  slug?: string
  title: string
  intro?: string
  cover: string
  body: string
  conclusion?: string
  createdBy: string
  createdAt?: string
};

// files: src/utils/service.ts
// files: src/utils/types.ts
export interface IMessage {
  name: string
  email: string
  message: string
};

// files: src/utils/utils.ts
// files: src/utils/data.ts
// files: src/utils/types.ts
export interface IBlog {
  company: {
    logo: string
    hero: IHero
    information: string
    video: string
  }
  posts: IPost[]
  messages: IMessage[]
};

// types: src/utils/service.ts,
// types: src/utils/types.ts,
// types: src/layouts/Header.tsx
export interface ISearchResult {
  total: number
  posts: IPost[]
  error?: string
};
