import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import "./dashboard.css";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart } from "react-chartjs-2";
import { getProductsAdmin } from "../../redux/actions/ProductActions";
import { getAllOrders } from "../../redux/actions/orderActions";
import { getAllUsers } from "../../redux/actions/UserActions";

const Dashboard = () => {

  const dispatch = useDispatch();

  const {products} = useSelector((state)=>state.getProduct)
  const { orders } = useSelector((state) => state.allOrdersReducer);
  const { users } = useSelector((state) => state.getAllUsers);

  let outOfStock = 0;

  products &&
    products.forEach((item) => {
      if (item.stock === 0) {
        outOfStock += 1;
      }
    });

  useEffect(() => {
    dispatch(getProductsAdmin());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  let totalAmount = 0;
  orders &&
    orders.forEach((item) => {
      totalAmount += item.totalPrice;
    });

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmount],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#00A6B4", "#6800B4"],
        hoverBackgroundColor: ["#4B5000", "#35014F"],
        data: [outOfStock, products?.length - outOfStock],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel| E-Commerce" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Amount <br /> ₹{Math.round(totalAmount * 100) / 100}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            <Link to="/admin/products">
              <p style={{fontSize:"2vw"}}>Product</p>
              <p  >{products && products?.length}</p>
            </Link>
            <Link to="/admin/orders">
              <p style={{fontSize:"2vw"}} >Orders</p>
              <p>{orders && orders?.length}</p>
            </Link>
            <Link to="/admin/users">
              <p style={{fontSize:"2vw"}} >Users</p>
              <p>{users && users?.length}</p>
            </Link>
          </div>
        </div>

        <div className="lineChart">
          <Line data={lineState} />
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
