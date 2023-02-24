import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

import "./profile.css";

const Profile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.getUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false&& loading === false) {
      navigate("/LoginSignup");
    }
    // eslint-disable-next-line
  }, [navigate, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${user?.name}'s Profile | E-Commerce`} />

          <h1 className="PageHeading">My Profile</h1>

          <div className="profileContainer">
            <div>
              <img
                src={user?.avatar ? user?.avatar : "/Profile.png"}
                alt={user?.name}
              />
              <Link to="/profile/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{user?.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{user?.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(user?.createdAt).substring(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
