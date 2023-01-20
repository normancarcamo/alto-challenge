import "./Loader.scss";

type Children = JSX.Element | null | false | "" | undefined;

type LoaderProps = {
  isProcessing: boolean
  children?: Children | Children[]
};

export const Loader = (props: LoaderProps) => {
  if (props.isProcessing) {
    return (
      <span id="loader" className="loader">|</span>
    );
  }

  if (!props.children) {
    return null;
  }

  return <>{props.children}</>;
};
