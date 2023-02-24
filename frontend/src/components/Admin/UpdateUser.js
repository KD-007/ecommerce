import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SideBar from "./Sidebar";
import { getSpecificUser, updateUser, clearErrors } from "../../redux/actions/UserActions";
import Loader from "../layout/Loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { notify } from "../../utils/Notification";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { loading, error, user,isUpdated ,updateLoading} = useSelector((state) => state.getSpecificUser);


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const userId = params.id;

  useEffect(()=>{
    if(!user || user._id !== userId ){
      dispatch(getSpecificUser(userId));
    }
  },[dispatch,userId , user])
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      notify("success", "User updated successfully");
      navigate("/admin/users");
      dispatch(clearErrors());
    } 
  }, [dispatch, error, navigate, isUpdated, user]);

  const updateUserSubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("role", role);

    dispatch(updateUser(userId, myForm));
  };

  return (
    <Fragment>
      <MetaData title="Update User | E-Commerce" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          {loading ? (
            <Loader />
          ) : (
            <form
              className="createProductForm"
              onSubmit={updateUserSubmitHandler}
            >
              <h1>Update User</h1>

              <div>
                <PersonIcon />
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <MailOutlineIcon />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <VerifiedUserIcon />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Choose Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <Button
                id="createProductBtn"
                type="submit"
                disabled={
                  updateLoading ? true : false || role === "" ? true : false
                }
              >
                Update
              </Button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateUser;
