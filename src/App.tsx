import "./App.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./layouts/Header";

import {
  About,
  BlogPostDetails,
  BlogPostForm,
  BlogPostsList,
  ContactForm,
  Home,
  NotFound,
} from "./pages";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog">
          <Route index element={<BlogPostsList />} />
          <Route path=":slug">
            <Route index element={<BlogPostDetails />} />
            <Route path="edit" element={<BlogPostForm />} />
          </Route>
          <Route path="new" element={<BlogPostForm />} />
        </Route>
        <Route path="/contact" element={<ContactForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
