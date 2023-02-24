import React , {useState} from "react";
import { Link, Outlet ,useNavigate} from "react-router-dom";
import './Header.css';
import UserOptions from "./UserOptions.js"



const Header = ({user}) => {

  const navigate = useNavigate();
  const [keyword, setkeyword] = useState("");

  const onChange= (e)=>{
    setkeyword(e.target.value);
    console.log(keyword);
  }

  const search=(e)=>{
    e.preventDefault();
    if(keyword.trim()){
      navigate(`/products/${keyword}`);
      setkeyword("");
    }

  }

  const showNav = ()=>{
    const header = document.querySelector(".navList");
    header.classList.toggle("navListRes")
  }
    return <>
    <ul className="navList" > 
    <Link className="link" to="/" ><li id="listItem" > Home </li> </Link>
    <Link className="link" to="/products" ><li id="listItem" > Products </li> </Link>
    <Link className="link" to="/contact" ><li id="listItem" > Contact </li> </Link>
    <Link className="link" to="/LoginSignup" ><li id="listItem" >My Account </li> </Link>
    <Link className="link" to="/about" ><li id="listItem" >About  </li> </Link>
    <li id="searchBox" > <form onSubmit={search}> <input type="text" value={keyword} onChange={onChange} className="inputBox" /> <button  className="inputBtn" >Search</button></form> </li>  
    <div className="icon" onClick={showNav} ><i className="fa-solid fa-bars fa-xl"></i></div>
    </ul>
    {user && <UserOptions user={user} />}
  <Outlet/>
  </>
};

export default Header;
