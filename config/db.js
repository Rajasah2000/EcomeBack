const mongoose = require('mongoose');


const connectDb = async() => {
      try {
       await mongoose.connect(
          'mongodb+srv://practicewithenjoys:practice1234@practice.7nmlhek.mongodb.net/?retryWrites=true&w=majority'
        );
        console.log("Database connected successfully");
      } catch (error) {
        console.log("Faild to connect database");
        process.exit(0);
      }
  
}

module.exports = connectDb;