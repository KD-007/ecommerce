import React, { Fragment, useEffect } from "react";
import "./orderDetails.css";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { Link, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { getOrderDetails, clearErrors } from "../../redux/actions/orderActions";
import Loader from "../layout/Loader/Loader";
import { notify } from "../../utils/Notification";

const OrderDetails = () => {
  const { order, error, loading } = useSelector((state) => state.orderReducer);


  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    dispatch(getOrderDetails(id));
  }, [dispatch, error, id]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {order && <>
            <MetaData title="Order Details | E-commerce" />
          <div className="orderDetailsPage">
            <div className="orderDetailsContainer">
              <Typography component="h1">
                Order #{ order._id}
              </Typography>
              <Typography>Shipping Info</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p>Name:</p>
                  <span>{order.user.name}</span>
                </div>
                <div>
                  <p>Phone:</p>
                  <span>
                    {order.shippingInfo.phoneNo}
                  </span>
                </div>
                <div>
                  <p>Address:</p>
                  <span>
                    {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                  </span>
                </div>
              </div>
              <Typography>Payment</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.paymentInfo.status === "succeeded"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.paymentInfo.status === "succeeded"
                      ? "PAID"
                      : "NOT PAID"}
                  </p>
                </div>

                <div>
                  <p>Amount:</p>
                  <span> ₹ { order.totalPrice}</span>
                </div>
              </div>

              <Typography>Order Status</Typography>
              <div className="orderDetailsContainerBox">
                <div>
                  <p
                    className={
                      order.orderStatus === "Delivered"
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    {order.orderStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="orderDetailsCartItems">
              <Typography>Order Items:</Typography>
              <div className="orderDetailsCartItemsContainer">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div key={item.product}>
                      <img src={item.image} alt="Product" />
                      <Link to={`/product/${item.product}`}>
                        {item.name}
                      </Link>{" "}
                      <span>
                        {item.quantity} X ₹{item.price} ={" "}
                        <b>₹{item.price * item.quantity}</b>
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          </> }
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
