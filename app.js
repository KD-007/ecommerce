const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error'); 
const cookieParser = require('cookie-parser');
const dotenv= require("dotenv");
const path = require('path');

// var cors = require('cors')
// app.use(cors({
//   origin: ['http://localhost:3000'], // Frontend URL
//   credentials: true // Allow cookies to be sent and received
// }));


app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.use(
    express.urlencoded({
      extended: true,
    })
  );
  

const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");
const payment = require("./routes/paymentRoutes");

app.use("/api/v1" , product);
app.use("/api/v1" , user);
app.use("/api/v1" , order);
app.use("/api/v1" , payment);



app.use(errorMiddleware);

app.use(express.static(path.join(__dirname,"./frontend/build")));


app.get("*" , (req,res)=>{
  res.sendFile(path.join(__dirname , "./frontend/build/index.html")),
  function(err){
    res.status(500).send(err.message);
  }
});

module.exports = app;