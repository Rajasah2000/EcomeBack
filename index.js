const express = require('express');
const connectDb = require('./config/db');
const app = express();
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(bodyParser?.urlencoded({extended:false}))

app.use('/api/user', authRoutes);
app.use('/api/product', productRoutes);
app.use(cookieParser())

//  after routes call middleware and install express async handler and use usercontroll file

app.use(notFound);
app?.use(errorHandler);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT :${PORT}`);
  });
  
});




