const mongoose = require('mongoose');
const validMongoDbId =(id) => {
  const isValid =  mongoose.Types.ObjectId.isValid(id);
  if(!isValid){
    res?.json({
        msg:"This id is not valid or not found"
    })
    // throw new Error("This id is not valid or not found")
  }
}

module.exports = validMongoDbId