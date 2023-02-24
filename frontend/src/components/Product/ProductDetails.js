import React, { Fragment, useEffect, useState } from "react";
import  ReviewCard from "./ReviewCard"
import Loader from "../layout/Loader/Loader"
import "./ProductDetails.css";
import {useSelector, useDispatch} from 'react-redux';
import {clearErrors, getSingleProduct} from '../../redux/actions/ProductActions';
import { useParams } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import Rating from '@mui/material/Rating';
import { notify } from "../../utils/Notification";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../redux/actions/cartActions";
import { clearErrorsCart } from "../../redux/actions/cartActions";
import { newReview } from "../../redux/actions/ProductActions";
import { useNavigate } from "react-router-dom";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button
   } from '@mui/material';




const ProductDetails = () => {

   const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const {product, loading , error} = useSelector((state)=> state.getSingleProduct)
  const { errorCart , messageCart } = useSelector((state)=> state.cartReducer)
  const { message:revsuccess, error: reviewError } = useSelector((state) => state.reviewReducer);

  useEffect(()=>{
    dispatch(getSingleProduct(id)) 
  },[dispatch , id , revsuccess])

  useEffect(()=>{
    if(error || errorCart || reviewError){
      notify("warn", error|| errorCart || reviewError);
    }
    if( messageCart|| revsuccess){
      notify("success",  messageCart|| revsuccess);
    }

    if(!loading && !product && error){
      navigate("*");
    }

    dispatch(clearErrorsCart())
    dispatch(clearErrors())

    
  },[dispatch , error  , errorCart , messageCart , reviewError ,revsuccess])




  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState("0");
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;
    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () => {
    dispatch(newReview({rating: rating, comment: comment , productID: id}));
    setOpen(false);
  };

  const options = {
    size: "large",
    value: product?.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return ( <Fragment>{loading ? <Loader/>:<>{product && <Fragment>
    <MetaData title={`${product.name} -- ECOMMERCE`} />
     <div className="ProductDetails">
       <div className="imgBox" >
         <Carousel>
           {product.image &&
             product.image.map((item, i) => (
               <img
                 key={i}
                 src={item}
                 alt={`${i} Slide`}
               />
             ))}
         </Carousel>
       </div>
 
       <div>
         <div className="detailsBlock-1">
           <h2>{product.name}</h2>

           <p>Product # {product._id}</p>
         </div>
         <div className="detailsBlock-2">
           <Rating {...options} />
           <span className="detailsBlock-2-span">
             {" "}
             ({product.numOfReviews} Reviews)
           </span>
         </div>
         <div className="detailsBlock-3">
           <h1>{`₹${product.price}`}</h1>
           <div className="detailsBlock-3-1">
           <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <span style={{margin: "1vmax"}} >{quantity}</span>
                    <button onClick={increaseQuantity}>+</button>
                  </div>
             <button
               disabled={product.Stock < 1 ? true : false}
               onClick={addToCartHandler}
             >
               Add to Cart
             </button>
           </div>
 
           <p>
             Status:
             <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
               {product.Stock < 1 ? "OutOfStock" : "InStock"}
             </b>
           </p>
         </div>
 
         <div className="detailsBlock-4">
           Description : <p>{product.description}</p>
         </div>
 
         <button onClick={submitReviewToggle} className="submitReview">
           Submit Review
         </button>
       </div>
     </div>
 
     <h3 className="reviewsHeading">REVIEWS</h3>
 
     <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                onChange={(e) => {setRating(e.target.value)}}
                value={Number(rating)}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
 
     {product.reviews && product.reviews[0] ? (
       <div className="reviews">
         {product.reviews &&
           product.reviews.map((review) => (
             <ReviewCard key={review._id} review={review} />
           ))}
       </div>
     ) : (
       <p className="noReviews">No Reviews Yet</p>
     )}
   </Fragment>}
   </> }

     </Fragment>     
  )
};

export default ProductDetails;
