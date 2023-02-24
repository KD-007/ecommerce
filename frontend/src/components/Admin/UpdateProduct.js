import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getSingleProduct,
  updateProduct,
} from "../../redux/actions/ProductActions";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SideBar from "./Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import {notify} from "../../utils/Notification"

const UpdateProduct = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { error, product } = useSelector((state) => state.getSingleProduct);

  const {
    loading,
    error: updateError,
    success,
  } = useSelector((state) => state.ProductReducer);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
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

  const productId = params.id;

  useEffect(() =>{
    if(!product ||  product._id !== productId ){
      dispatch(getSingleProduct(productId));
    }
    if (product && product._id == productId) {
      setName(product?.name);
      setDescription(product?.description);
      setPrice(product?.price);
      setCategory(product?.category);
      setStock(product?.Stock);
      setOldImages(product?.image);
    }

  },[dispatch , product ,  productId])

  useEffect(() => {

    if (error) {
      notify("error", error);
    }

    if (updateError) {
      notify("error" , updateError);
      
    }

    if (success) {
      notify("success","Product Updated Successfully");
      navigate("/admin/products");
      
    }
    dispatch(clearErrors());
  }, [
    dispatch,
    error,
    navigate,
    success,
    product,
    updateError,
  ]);

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

  const updateProductSubmitHandler = (e) => {
    e.preventDefault();
    if(images.length>0) {
      setuploadingImage(true);
      Promise.all(images.map( (image) => {
        return uploadImage(image);
     })).then((values) => {
      const obj = {name:name , price:price , description:description , category , Stock:stock , image:values}
      setuploadingImage(false);
      dispatch(updateProduct(obj , productId));
      })
    }else{
      const obj = {name:name , price:price , description:description , category , Stock:stock , image:oldImages}
      dispatch(updateProduct(obj , productId));
    }


  };

  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const imagesPreviewUrl = files.map((image) => URL.createObjectURL(image));
    setImagesPreview(imagesPreviewUrl);
  };
  return (
    <Fragment>
      <MetaData title="Update Product | E-commerce" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>

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
                placeholder="Price"
                required
                onChange={(e) => setPrice(e.target.value)}
                value={price}
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
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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
                required
                onChange={(e) => setStock(e.target.value)}
                value={stock}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image} alt="Old Product Preview" />
                ))}
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
                {uploadingImage ? "Uploading..." : "Update"}
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
