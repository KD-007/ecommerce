import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component" 

const ProductCard = ({ product }) => {
  const options = {
    value: product.ratings,
    precision: 0.5,
    isHalf: true,
  };
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={ product.image && product.image[0]} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />{" "}
        <span className="productCardSpan">
          {" "}
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
