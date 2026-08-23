const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const clgDev = require('./utils/clgDev');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');
const cloudinaryConnect = require('./config/cloudinaryConnect');

dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 4000;
const app = express();
cloudinaryConnect();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyNotion API is running',
  });
});

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'StudyNotion API is healthy',
  });
});

// Vercel reuses warm function instances. Cache the MongoDB connection and
// establish it only for routes that actually need database access.
app.use('/api/v1', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Mount routes
const AuthR = require('./routes/AuthR');
const CategoryR = require('./routes/CategoryR');
const CourseProgressR = require('./routes/CourseProgressR');
const CourseR = require('./routes/CourseR');
const PaymentR = require('./routes/PaymentR');
const ProfileR = require('./routes/ProfileR');
const ReviewR = require('./routes/ReviewR');
const SectionR = require('./routes/SectionR');
const SubSectionR = require('./routes/SubSectionR');
const UserR = require('./routes/UserR');
const OtherR = require('./routes/OtherR');

app.use('/api/v1/auth', AuthR);
app.use('/api/v1/categories', CategoryR);
app.use('/api/v1/courses', CourseR);
// app.use('/api/v1/payments', PaymentR);
app.use('/api/v1/profiles', ProfileR);
app.use('/api/v1/reviews', ReviewR);
app.use('/api/v1/sections', SectionR);
app.use('/api/v1/subsections', SubSectionR);
app.use('/api/v1/users', UserR);
app.use('/api/v1/other', OtherR);
app.use('/api/v1/courseprogress', CourseProgressR);

app.use(errorHandler); // must be after mounting the routes

if (require.main === module) {
  app.listen(PORT, (err) => {
    if (err) {
      clgDev('Error occurred creating server');
      process.exit(1);
    }
    clgDev(`Server is running on ${PORT}`.yellow.underline.bold);
  });
}

module.exports = app;
