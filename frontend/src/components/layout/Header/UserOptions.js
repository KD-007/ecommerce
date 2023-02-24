import React, { Fragment, useState } from "react";
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom";
import {ToastContainer} from "react-toastify";
import { logout , clearErrors } from "../../../redux/actions/UserActions";
import { useDispatch, useSelector } from "react-redux";
import Backdrop from '@mui/material/Backdrop';

const UserOptions = ({user}) => {
  const { cartItems } = useSelector((state) => state.cartReducer);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems?.length > 0 ? "rgb(97, 61, 41)" : "unset" }}
        />

      ),
      name: `Cart(${cartItems?.length ? cartItems?.length :0 })`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user?.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }

  function dashboard() {
    navigate("/admin/dashboard");
  }

  function orders() {
    navigate("/orders");
  }
  function account() {
    navigate("/account");
  }
  function cart() {
    navigate("/cart");
  }

  function logoutUser() {
    dispatch(logout());
    dispatch(clearErrors());
  }



  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} /> 
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        open={open}
        direction="up"
        className="speedDial"
        icon={
          <img
            className="speedDialIcon"
            src={user?.avatar ? user.avatar : "/Profile.png"}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
      <ToastContainer/>
    </Fragment>
  );
};

export default UserOptions;
