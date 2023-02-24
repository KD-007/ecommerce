import React, { useEffect, useRef } from "react";
import Metadata from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { clearErrors, createOrder } from "../../redux/actions/orderActions";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import "./payment.css";
import { Typography } from "@mui/material";
import { notify } from "../../utils/Notification";
import { BACKEND } from "../../utils/constData";

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payBtn = useRef(null);

  const { shippingInfo, cartItems } = useSelector((state) => state.cartReducer);
  const { user } = useSelector((state) => state.getUser);
  const { error } = useSelector((state) => state.orderReducer);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };

  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemPrice: orderInfo?.subtotal,
    taxPrice: orderInfo?.tax,
    shippingPrice: orderInfo?.shippingCharges,
    totalPrice: orderInfo?.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials:true,
      };
      const { data } = await axios.post(
        `${BACKEND}/api/v1/payment/process`,
        paymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: shippingInfo.country,
            },
          },
        },
      });
      

      if (result.error) {
        payBtn.current.disabled = false;

        notify("error",result.error.message)
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };

          dispatch(createOrder(order));

          navigate("/success");
        } else {
          notify("error","There's some issue while processing payment ")
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      notify("error", error.response.data.message)
    }
  };

  useEffect(() => {
    if (error) {
      notify("error", error)
      dispatch(clearErrors());
    }
  }, [dispatch,error]);

  return (
    <>
      <Metadata title="Payment | E-Commerce" />
      <CheckoutSteps activeStep={2} />
      <div className="paymentContainer">
        <form
          action=""
          className="paymentForm"
          onSubmit={(e) => submitHandler(e)}
        >
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <CardNumberElement className="paymentInput" />
          </div>
          <div>
            <EventIcon />
            <CardExpiryElement className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <CardCvcElement className="paymentInput" />
          </div>
          <input
            type="submit"
            value={`Pay ₹${orderInfo && Math.round(orderInfo.totalPrice* 100)/100}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </>
  );
};

export default Payment;
