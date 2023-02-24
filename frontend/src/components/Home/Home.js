import React, {useEffect} from "react";
import { Outlet } from "react-router-dom";
import "./Home.css";
import ProductCard from "./ProductCard";
import {useSelector , useDispatch} from 'react-redux'
import { clearErrors, getProducts } from "../../redux/actions/ProductActions";
import Loader from "../layout/Loader/Loader";
import { notify } from "../../utils/Notification";

const Home = () => {
  const {products, loading , error , productCount} = useSelector((state)=>state.getProduct)

  const dispatch = useDispatch();
  useEffect( ()=>{
   dispatch(getProducts())
   // eslint-disable-next-line
  },[dispatch])

  useEffect(()=>{
    if(error){
      notify("error", error);
      dispatch(clearErrors())
    }
    // eslint-disable-next-line
  },[error])


  return (
    <div >
          {loading? <Loader/>:<><div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll 
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="container" id="container">
            
            {products && products.map((product)=>{
              return <ProductCard key={product?._id} product={product}/>
            })}
          </div></>}

     <Outlet/>
          
    </div>
  );
};

export default Home;
