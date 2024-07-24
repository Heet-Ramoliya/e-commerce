import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ flex: 1 }}> {children} </main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce app - shop now",
  description: "This MERN stack project",
  keywords: "MERN,ReactJs,NodeJs,MongoDB",
  author: "Heet Ramoliya",
};

export default Layout;
