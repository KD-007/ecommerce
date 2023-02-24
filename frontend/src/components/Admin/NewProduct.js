import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, createProduct } from "../../redux/actions/ProductActions";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SideBar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const NewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.newProductReducer);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [uploadingImage, setuploadingImage] = useState(false);

  const categories = [
    "Laptops",
    "Clothes",
    "Smartphones",
    "Footwears",
    "Accessories",
    "Electronics",
  ];

  useEffect(() => {
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (success) {
      notify("success","Product Created Successfully");
      dispatch(clearErrors());
      navigate("/admin/dashboard");
    }
  }, [dispatch, error, navigate, success]);


  const uploadImage = async (image)=>{
    const data = new FormData();
    data.append('file' , image);
    data.append('upload_preset', 'fzhcr1nb');
    try {

      let res = await fetch("http://api.cloudinary.com/v1_1/dsyz3bvhp/image/upload", {
            method:"post",
            body:data
      })
      const urlData = await res.json();
 
      return urlData.url
      
    } catch (error) {
      notify("error", error);
    }
  }

  const createProductSubmitHandler = async (e) => {
    e.preventDefault();

    if(images.length==0) return notify("warn" , "please upload product images");
    
    setuploadingImage(true);
    Promise.all(images.map( (image) => {
      return uploadImage(image);
   })).then((values) => {
    const obj = {name:name , price:price , description:description , category , Stock:stock , image:values}
    setuploadingImage(false);
    dispatch(createProduct(obj));
    })
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const imagesPreviewUrl = files.map((image) => URL.createObjectURL(image));
    setImagesPreview(imagesPreviewUrl);
  };

  return (
    <Fragment>
      <MetaData title="Create Product -Admin Panel | E-Commerce" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={createProductSubmitHandler}
          >
            <h1>Create Product</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Product Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <CurrencyRupeeIcon />
              <input
                type="number"
                min={1}
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div>
              <AccountTreeIcon />
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <StorageIcon />
              <input
                type="number"
                placeholder="Stock"
                min={1}
                required
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading || uploadingImage ? true : false}
            >
              {uploadingImage ? "Uploading..." : "Create"}
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;
