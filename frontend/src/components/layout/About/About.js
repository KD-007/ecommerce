import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/kuldeep-verma-7a640b244/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://media.licdn.com/dms/image/C4D03AQENuXZiJwdHZg/profile-displayphoto-shrink_800_800/0/1658298400021?e=1682553600&v=beta&t=k_rlFPqwJpc-sqf9UKKezeFR6VCm99dUTObinNuaGfw"
              alt="Founder"
            />
            <Typography>Kuldeep Verma</Typography>
            <Button onClick={visitLinkedIn} color="primary">
              Visit Linkedin
            </Button>
            <span>
              This is a sample wesbite made by @KuldeepVerma.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
