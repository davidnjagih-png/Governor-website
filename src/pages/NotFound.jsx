import { Link } from "react-router-dom";
import Seo from "../components/Seo";

function NotFound() {
  return (
    <>
      <Seo title="Page not found" noindex />
      <section className="page-hero">
        <div className="container">
          <h1>Page not <span className="accent">found.</span></h1>
          <p className="lead">That page does not exist or has moved.</p>
          <Link to="/" className="btn btn-yellow">Back to home</Link>
        </div>
      </section>
    </>
  );
}

export default NotFound;
