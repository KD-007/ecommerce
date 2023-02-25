const app = require('./app');
const mongoose = require('mongoose');



process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to uncaughtException");
        process.exit(1)
})



mongoose.set('strictQuery', true);

mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
      }).then(()=>{
        console.log("database is connected");
    }).catch((e)=>{
        console.log("error connecting to database" ,e);
    });


const port  = process.env.PORT || 4000 ;

const server = app.listen( port , ()=>{
    console.log('listening on port '+port);
})

process.on("unhandledRejection",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1)
    })
})