import { Link } from "react-router-dom";

import "./Logo.scss";

type LogoProps = {
  url?: string | null
  to?: string
  onClick?: () => void
};

export const Logo = (props: LogoProps) => {
  const link = props.to ?? "/";

  return (
    <div className="logo">
      <Link to={link} title="Go to Home site section" onClick={props.onClick}>
        <img 
          
          alt="Blog's logo" 
          src={props?.url ?? "/placeholder.svg"}
        />
      </Link>
    </div>
  );
};
