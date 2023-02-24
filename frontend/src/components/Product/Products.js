import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProducts } from "../../redux/actions/ProductActions";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import Pagination from "react-js-pagination";
import {Outlet , useParams} from "react-router-dom";
import {Typography,Slider} from '@mui/material';
import MetaData from "../layout/MetaData";
import { notify } from "../../utils/Notification";

const categories = [
  "Laptops",
  "Footwears",
  "Clothes",
  "Smartphones",
  "Accessories",
  "Electronics",
];

const Products = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 3000]);
  const [category, setCategory] = useState("");

  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.getProduct);

  const {keyword} =useParams();

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);

  };
  let count = filteredProductsCount;

  useEffect(() => {
    dispatch(getProducts(keyword, currentPage, price, category, ratings));
  }, [dispatch,keyword, currentPage, price, category, ratings]);

  useEffect(()=>{

    if(error){

      notify("error", error);
      dispatch(clearErrors())
    }
    // eslint-disable-next-line
  },[error])

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />
          <h2 className="productsHeading">Products</h2>

          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>

            <Slider
              onChange={priceHandler}
              value={price}
              aria-labelledby="range-slider"
              // aria-label="Small"
              getAriaLabel={() => 'Price range'}
              valueLabelDisplay="auto"
              min={0}
              max={3000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
      <Outlet/>
    </Fragment>
  );
};

export default Products;
