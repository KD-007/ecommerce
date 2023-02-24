import React ,{useEffect} from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./orderSuccess.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { refreashCart } from "../../redux/actions/cartActions";


const OrderSuccess = () => {
  const disPatch = useDispatch();
  useEffect(() => {
  disPatch(refreashCart())
  }, [disPatch])
  return (
    <div className="orderSuccess">

      <CheckCircleIcon />

      <Typography>Your Order has been Placed successfully </Typography>
      <Link to="/orders">View Orders</Link>
    </div>
  );
};

export default OrderSuccess;
