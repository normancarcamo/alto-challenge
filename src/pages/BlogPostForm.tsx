import { useState, FormEvent, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./BlogPostForm.scss";

import { Loader } from "../components";
import { genSlug, genId, loadImage } from "../utils/utils";
import { submitEditPostForm, submitNewPostForm } from "../utils/service";
import { blogPostEmpty } from "../utils/data";

import type { IPost } from "../utils/types";

export const BlogPostForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<Error|null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const postToEdit = location.state?.post as IPost;
  const [formCoverURL, setFormCoverURL] = useState(postToEdit?.cover ?? "");
  const [defaultValues] = useState<IPost>(postToEdit ?? blogPostEmpty);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      const data = form.elements as any;
      const slug = genSlug(data.title.value);
      const newPost: IPost = {
        id: postToEdit?.id ?? genId(),
        title: data.title.value,
        slug,
        intro: data.intro.value,
        cover: data.cover.value,
        body: data.body.value,
        conclusion: data.conclusion.value,
        createdAt: postToEdit?.createdAt ?? new Date().toISOString(),
        createdBy: data.createdBy.value,
      };
      setIsFormLoading(true);
      setFormError(null);
      if (postToEdit) {
        await submitEditPostForm(newPost);
      } else {
        await submitNewPostForm(newPost);
      }
      setFormCoverURL("");
      setIsFormLoading(false);
      form.reset();
      navigate(`/blog/${slug}`);
    } catch (error) {
      setFormError(error as Error);
      setIsFormLoading(false);
    }
  };

  const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setIsImageLoading(true);
    try {
      const url = event.currentTarget.value;
      await loadImage(url);
      setFormCoverURL(url);
    } catch (error) {
      setFormCoverURL("");
    }
    setIsImageLoading(false);
  };

  const formPrefix = postToEdit ? "Edit" : "Add";
  const title = defaultValues.title;
  const intro = defaultValues.intro;
  const createdBy = defaultValues.createdBy;
  const body = defaultValues.body;
  const conclusion = defaultValues.conclusion;
  const formErrorMessage = formError?.message;
  const submitLabel = postToEdit ? "Save" : "Create";

  return (
    <section className="blog-post-form">
      <h1>{formPrefix} blog post</h1>
      <form onSubmit={onSubmit}>
        <div className="title">
          <label htmlFor="title">Title <span>*</span></label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            placeholder="Example: “Content Marketing for Artists: A Beginner’s Guide.”"
            disabled={isFormLoading} 
            defaultValue={title}
            autoFocus
            required 
          />
        </div>
        <div className="intro">
          <label htmlFor="intro">Intro</label>
          <textarea 
            id="intro" 
            name="intro" 
            placeholder="(Optional) Short intro"
            rows={2} 
            disabled={isFormLoading} 
            defaultValue={intro}
          />
        </div>
        <div className="cover">
          <label htmlFor="cover">Cover</label>
          <input 
            type="text" 
            id="cover" 
            name="cover" 
            placeholder="(Optional) CDN URL" 
            onChange={onImageChange}
            disabled={isFormLoading} 
            defaultValue={formCoverURL}
          />
          <Loader isProcessing={isImageLoading}>
            <img 
              src={formCoverURL} 
              title="Cover image url for the post" 
              alt="Failed to load the image"
            />
          </Loader>
        </div>
        <div className="createdBy">
          <label htmlFor="createdBy">Author <span>*</span></label>
          <input 
            type="createdBy" 
            id="createdBy" 
            name="createdBy" 
            placeholder="Example: “John Doe”"
            disabled={isFormLoading} 
            defaultValue={createdBy}
            required 
          />
        </div>
        <div className="body">
          <label htmlFor="body">Body <span>*</span></label>
          <textarea 
            id="body" 
            name="body" 
            rows={10} 
            placeholder="Discuss all aspects of the topic in ample detail."
            disabled={isFormLoading} 
            defaultValue={body}
            required 
          />
        </div>
        <div className="conclusion">
          <label htmlFor="conclusion">Conclusion</label>
          <textarea 
            id="conclusion" 
            name="conclusion" 
            placeholder="(Optional) Brief conclusion"
            rows={2} 
            disabled={isFormLoading} 
            defaultValue={conclusion}
          />
        </div>
        <p className="error">{formErrorMessage}</p>
        <Loader isProcessing={isFormLoading}>
          <input 
            className="submit" 
            type="submit" 
            value={submitLabel} 
            disabled={isFormLoading} 
          />
        </Loader>
      </form>
    </section>
  );
};
