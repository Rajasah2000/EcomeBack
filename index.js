const express = require('express');
const cors = require('cors');
const multer = require('multer');
const connectDb = require('./config/db');
const app = express();
app.use(cors());
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./routes/UserRoutes')
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 3004;
app.use(bodyParser.json());
app.use(bodyParser?.urlencoded({ extended: false }));

// Image Upload

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/api/admin/image-upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.send({ status: false, message: 'No files were uploaded.' });
  }
  const localUrl = `http://localhost:3004/${req.file.path}`;
  res.send({ status: true, url: localUrl, message: 'File uploaded successfully.' });
});

//    End of image upload......

app.use('/api/admin', authRoutes);

// app.use('/api/user',userRoutes)
// app.use('/api/product', productRoutes);
app.use(cookieParser());

//  after routes call middleware and install express async handler and use usercontroll file

app.use(notFound);
app?.use(errorHandler);
//  connectDb().users.dropIndex("resetToken_1")
connectDb().then(() => {
 

  app.listen(PORT, () => {
    console.log(`Server is running at PORT :${PORT}`);
  });
});
