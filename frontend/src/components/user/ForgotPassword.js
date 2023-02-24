import React, { Fragment, useState, useEffect } from "react";
import "./ForgotPassword.css";
import Loader from "../layout/Loader/Loader";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, forgotPassword } from "../../redux/actions/UserActions";
import MetaData from "../layout/MetaData";
import { notify } from "../../utils/Notification";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector((state) => state.forgotPasswordReducer);

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      notify("error", error);

    }

    if (message) {
      notify("success", message);
    }
    dispatch(clearErrors());
    
  }, [dispatch, error, message]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Forgot Password | E-Commerce" />
          <div className="forgotPasswordContainer">
            <div className="forgotPasswordBox">
              <h2 className="forgotPasswordHeading">Forgot Password</h2>

              <form
                className="forgotPasswordForm"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="forgotPasswordEmail">
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

                <input
                  type="submit"
                  value="Send Reset Link"
                  className="forgotPasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
