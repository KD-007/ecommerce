import React, { Fragment, useState, useEffect } from "react";
import "./updateProfile.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FaceIcon from '@mui/icons-material/Face';
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updateProfile, loadUser } from "../../redux/actions/UserActions";
import MetaData from "../layout/MetaData";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.getUser);
  const { error, isUpdated, loading , message } = useSelector((state) => state.profileReducer);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [uploadingImage, setuploadingImage] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);


  const uploadImage=async(image)=>{
    const data = new FormData();
    data.append('file' , image);
    data.append('upload_preset', 'fzhcr1nb');
    try {
      setuploadingImage(true)
      let res = await fetch("http://api.cloudinary.com/v1_1/dsyz3bvhp/image/upload", {
            method:"post",
            body:data
      })
      const urlData = await res.json();
      setuploadingImage(false);
      return urlData.url
      
    } catch (error) {
      setuploadingImage(false);
      notify("error", error);
    }
  }

  const updateProfileSubmit = async (e) => {
    e.preventDefault();
    let url = user.avatar;
    if(image){
      url =  await uploadImage(image);
    }

    dispatch(updateProfile({name: name , email: email , avatar:url}));
  };

  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];
    if(file.size> 1048576){
      return notify("error", "Image size exceeds 1MB");
    }else{
      setImage(file)
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar);
    }

    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      notify("success", message);
      dispatch(loadUser());
      dispatch(clearErrors());
      navigate("/account");
    }
    // eslint-disable-next-line
  }, [dispatch, error, navigate, user, isUpdated]);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Profile | E-commerce" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2 className="updateProfileHeading">Update Profile</h2>

              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input disabled={uploadingImage===true ? true : false}
                  type="submit"
                  value={uploadingImage===true ? "Please wait image is uploading" : "Update"}
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
