import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminMenu from "../../components/Layouts/AdminMenu";
import Layout from "../../components/Layouts/Layout";

const Products = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
      );
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div
            className="d-flex flex-wrap justify-content-center"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {products?.map((item) => (
              <Link
                key={item._id}
                to={`/dashboard/admin/product/${item.slug}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "18rem",
                  margin: "1rem",
                }}
              >
                <div
                  className="card"
                  style={{
                    width: "100%",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`}
                    className="card-img-top"
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                  <div className="card-body" style={{ padding: "1rem" }}>
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
