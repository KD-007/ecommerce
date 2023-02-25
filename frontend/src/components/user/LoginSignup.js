import React, { useState } from "react";
import { useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {loginUser,registerUser} from "../../redux/actions/UserActions";
import { useEffect } from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from "@mui/icons-material/LockOpen";
import FaceIcon from "@mui/icons-material/Face";
import Loader from "../layout/Loader/Loader";
import "./auth.css";
import MetaData from "../layout/MetaData";
import { notify } from "../../utils/Notification";


const LoginSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const { loading, isAuthenticated } = useSelector((state)=> state.getUser);



  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { email, name, password } = user;


  const [image, setimage] = useState(null);
  const [imagePreview, setimagePreview] = useState(null);
  const [uploadingImage, setuploadingImage] = useState(false);



  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(loginEmail, loginPassword));
  };
  const registerSubmit = async(e) => {
    e.preventDefault();
    if(!image) return alert("Please upload a profile image");
    const url = await uploadImage(image);
    dispatch(registerUser({name:name ,email:email,password:password , avatar:url}));
  };

  const uploadImage = async (image)=>{
    const data = new FormData();
    data.append('file' , image);
    data.append('upload_preset', 'f6qooums');
    try {

      let res = await fetch("https://api.cloudinary.com/v1_1/dojvydh84/image/upload", {
            method:"post",
            body:data
      })
      const urlData = await res.json();
      setuploadingImage(false);
      return urlData.url
      
    } catch (error) {
      setuploadingImage(false);
      notify("error" , error);
    }
  }
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if(file.size> 1048576){
        return notify("warn" , "Image size Exceeds 1MB");
      }else{
        setimage(file);
        setimagePreview(URL.createObjectURL(file));
      }
    }else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };


  useEffect(() => {

    if (isAuthenticated) {

      navigate("/account");
    }
  }, [dispatch, isAuthenticated, navigate]);

  const switchTabs = (e, tab) => {
    if (tab === "login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "register") {
      switcherTab.current.classList.remove("shiftToNeutral");
      switcherTab.current.classList.add("shiftToRight");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
        <MetaData title={`Login-Signup | E-Commerce`} />
          <div className="LoginSignUpContainer">
            <div className="LoginSignUpBox">
              <div>
                <div className="login_signUp_toggle">
                  <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forget Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>
              <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={imagePreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value={ uploadingImage ?"please wait..." : "Register"} className="signUpBtn" />
              </form>
            </div>
          </div>
        </>
      )}
      
    </>
  );
};

export default LoginSignup;
