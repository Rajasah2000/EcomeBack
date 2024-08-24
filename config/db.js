const mongoose = require('mongoose');


const connectDb = async() => {
      try {
       await mongoose.connect('mongodb+srv://rajasah30030:rajasah30030@cluster0.pooe3.mongodb.net/testmode');
        console.log("Database connected successfully");
      } catch (error) {
        console.log("Faild to connect database");
        process.exit(0);
      }
  
}

module.exports = connectDb;