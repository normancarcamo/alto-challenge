import { FormEvent, useState } from "react";

import "./Contact.scss";

import { Loader } from "../components";
import { submitContactForm } from "../utils/service";

export const ContactForm = () => {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [formError, setFormError] = useState<Error|null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      const data = form.elements as any;
      const name = data.name.value;
      const email = data.email.value;
      const message = data.message.value;
      setIsFormLoading(true);
      setFormError(null);
      await submitContactForm({ name, email, message });
      setIsFormLoading(false);
      form.reset();
    } catch (error) {
      setFormError(error as Error);
      setIsFormLoading(false);
    }
  };

  return (
    <section className="contact-form">
      <h1>Contact Us</h1>
      <form onSubmit={onSubmit}>
        <div className="name">
          <label htmlFor="name">Your name <span>*</span></label>
          <input 
            id="name" 
            type="text" 
            name="name" 
            placeholder="Example: “John Doe”"
            disabled={isFormLoading} 
            required 
            autoFocus
          />
        </div>
        <div className="email">
          <label htmlFor="email">Your email <span>*</span></label>
          <input
            id="email" 
            type="email" 
            name="email" 
            placeholder="Example: “johndoe@gmail.com”"
            disabled={isFormLoading} 
            required 
          />
        </div>
        <div className="message">
          <label htmlFor="message">Message <span>*</span></label>
          <textarea
            id="message" 
            name="message" 
            placeholder="Example: “Hey, how’s it going”"
            rows={10} 
            disabled={isFormLoading} 
            required 
          />
        </div>
        <p className="error">{formError?.message}</p>
        <Loader isProcessing={isFormLoading}>
          <input 
            className="submit"
            id="submit" 
            type="submit" 
            name="submit" 
            value="Send message" 
            disabled={isFormLoading} 
          />
        </Loader>
      </form>
    </section>
  );
};
