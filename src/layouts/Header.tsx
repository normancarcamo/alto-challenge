import { FormEvent, KeyboardEvent, RefObject, useRef, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
  Link,
  NavLink,
} from "react-router-dom";

import "./Header.scss";

import { Logo } from "../components";
import { debounce } from "../utils/utils";
import { searchPosts } from "../utils/service";

import type { ISearchResult } from "../utils/types";

export const Header = () => {
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();
  const formRef = useRef(null);
  const menuRef = useRef(null);
  const textSearchFromURL = urlSearchParams.get("slug") ?? "";
  const [textSearch, setText] = useState(textSearchFromURL);
  const defaultSearchResults = { total: 0, posts: [] };
  const [textSearchResults, setSearchResults] = useState<ISearchResult>(
    defaultSearchResults
  );

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    const KEY_PRESSED = (event.key || event.code).toUpperCase();
    const value = event.currentTarget.value.toString().toLowerCase().trim();

    if (value !== textSearch) {
      setText(value);
    }

    if (KEY_PRESSED !== "ENTER") {
      debounce(300, async () => {
        const results = await searchPosts(value, 5);
        setSearchResults({ total: results.total, posts: results.posts });
      });
    }
  };

  const onSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (textSearch !== textSearchFromURL) {
      const slug = textSearch ? createSearchParams({ slug: textSearch }) : "";
      navigate({ pathname: "/blog", search: slug.toString() });
      setSearchResults(defaultSearchResults);
    }
  };

  const onItemResult = () => {
    const ref = formRef as unknown as RefObject<HTMLFormElement>;
    ref.current?.reset();
    setSearchResults(defaultSearchResults);
    onMenu();
  };

  const onMenu = () => {
    const element = menuRef.current as unknown as HTMLInputElement;
    if (element.checked) {
      element.checked = false;
    }
  };

  const onBackground = () => {
    setSearchResults(defaultSearchResults);
  };

  const onActiveRouter = (props: {isActive: boolean, isPending: boolean}) => {
    return props.isActive ? "active-route" : "";
  };

  return (
    <header className="header">
      <Logo onClick={onMenu} />
      <div className="icon">
        <svg viewBox="0 0 100 80" width="80" height="40">
          <rect y="0"  width="100" height="6"></rect>
          <rect y="30" width="100" height="6"></rect>
          <rect y="60" width="100" height="6"></rect>
        </svg>
      </div>
      <input type="checkbox" name="menu" ref={menuRef} />
      <nav className="menu">
        <form className="search" onSubmit={onSubmit} ref={formRef}>
          <label htmlFor="blog-search-input">Search the site</label>
          <div className="autocomplete">
            <input 
              type="search" 
              name="search"
              id="blog-search-input" 
              placeholder="Enter keyword" 
              onKeyUp={onKeyUp}
              defaultValue={textSearch}
            />
            <ul className="results">
              {textSearchResults.total > 0 && (
                <li className="total">
                  Found: {textSearchResults.total}
                </li>
              )}
              {textSearchResults.posts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/blog/${post.slug}`} onClick={onItemResult}>
                    {post.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <input 
            className="submit"
            type="submit" 
            id="blog-search-button" 
            value="search"
          />
        </form>
        <ul className="links">
          <li>
            <NavLink to="/" onClick={onMenu} className={onActiveRouter}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={onMenu} className={onActiveRouter}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/blog" onClick={onMenu} className={onActiveRouter}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={onMenu} className={onActiveRouter}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
      {textSearchResults.total > 0 && (
        <div className="results-background" onClick={onBackground} />
      )}
    </header>
  );
};
