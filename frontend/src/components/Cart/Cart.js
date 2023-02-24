import React, {useEffect} from "react";
import "./cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart, clearErrorsCart, removeItemFromCart } from "../../redux/actions/cartActions";
import Typography from '@mui/material/Typography';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, errorCart , messageCart  } = useSelector((state) => state.cartReducer);
  const increaseQuantity = (id,) => {
    dispatch(addItemsToCart(id, 1));
  };

  const decreaseQuantity = (id, quantity) => {
    dispatch(addItemsToCart(id, -1,true));
  };

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  useEffect(()=>{
    if(errorCart){
      notify("warn",errorCart);
    }
    if( messageCart){
      notify("success",messageCart);
    }

    dispatch(clearErrorsCart())


    
  },[dispatch ,  errorCart , messageCart])
  return (
    <>
      {!cartItems || cartItems?.length === 0 ? (
        <div className="emptyCart">
          <RemoveShoppingCartIcon />

          <Typography>No Product in Your Cart</Typography>
          <Link to="/products">View Products</Link>
        </div>
      ) : (
        <>
          <div className="cartPage">
            <div className="cartHeader">
              <p>Product</p>
              <p>Quantity</p>
              <p>Subtotal</p>
            </div>

            {cartItems &&
              cartItems.map((item) => (
                <div className="cartContainer" key={item.product}>
                  <CartItemCard item={item} deleteCartItems={deleteCartItems} />
                  <div className="cartInput">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.product, item.quantity)
                      }
                    >
                      -
                    </button>
                    <span style={{margin: "1vmax"}}>{item.quantity}</span>
                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.product,
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="cartSubtotal">{`₹${
                    item.price * item.quantity
                  }`}</p>
                </div>
              ))}

            <div className="cartGross">
              <div></div>
              <div className="cartGrossBox">
                <p>Gross Total</p>
                <p>{`₹${cartItems.reduce(
                  (acc, item) => acc + item.quantity * item.price,
                  0
                )}`}</p>
              </div>
              <div></div>
              <div className="checkOutBtn">
                <button onClick={checkoutHandler}>Check Out</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
