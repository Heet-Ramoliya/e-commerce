import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layouts/Layout";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { Spin } from "antd";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/getAll-category`
      );
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  // Total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // Filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/product-filter`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  const resetFilters = () => {
    setChecked([]);
    setRadio([]);
    getAllProducts();
  };

  return (
    <Layout title="All Products - Best offers">
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-2 mb-3">
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-flex flex-column">
              {category?.map((item) => (
                <Checkbox
                  key={item._id}
                  onChange={(e) => handleFilter(e.target.checked, item._id)}
                >
                  {item.name}
                </Checkbox>
              ))}
            </div>

            {/* Price Filter */}
            <h4 className="text-center mt-4">Filter By Price</h4>
            <div className="d-flex flex-column mt-4">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>

            <div className="d-flex flex-column">
              <button className="btn btn-danger" onClick={resetFilters}>
                RESET FILTER
              </button>
            </div>
          </div>
          <div className="col-md-10">
            <h1 className="text-center mb-4">All Products</h1>
            <div className="row">
              {loading ? (
                <Spin className="m-auto" size="large" />
              ) : (
                products?.map((p) => (
                  <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={p._id}>
                    <div
                      className="card h-100"
                      style={{
                        transition: "transform 0.2s ease-in-out",
                        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "translateY(-10px)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "translateY(0)")
                      }
                    >
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        className="card-img-top p-4"
                        alt={p.name}
                        style={{
                          objectFit: "cover",
                          height: "200px",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      />
                      <div
                        className="card-body d-flex flex-column"
                        style={{
                          padding: "20px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <h5
                          className="card-title"
                          style={{ fontWeight: "bold" }}
                        >
                          {p.name}
                        </h5>
                        <h5
                          className="card-price text-muted"
                          style={{ marginBottom: "10px" }}
                        >
                          $ {p.price}
                        </h5>
                        <p className="card-text">
                          {p.description.substring(0, 60)}...
                        </p>
                        <div
                          className="btn-group mt-auto"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <a
                            href={`/product/${p._id}`}
                            className="btn btn-outline-primary"
                            style={{
                              flex: 1,
                              marginRight: "5px",
                              borderRadius: "5px",
                            }}
                          >
                            View Details
                          </a>
                          <a
                            href={`/product/${p._id}`}
                            className="btn btn-primary"
                            style={{
                              flex: 1,
                              borderRadius: "5px",
                            }}
                          >
                            Add To Cart
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="m-2 p-3 text-center">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Load more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
