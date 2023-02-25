const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(()=>{
        console.log("database is connected");
    }).catch((e)=>{
        console.log("error connecting to database" ,e);
    });
}


module.exports = connectDatabase;


