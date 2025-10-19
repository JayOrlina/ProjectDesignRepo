import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import notesRoutes from './routes/notesRoutes.js';
import {connectDb} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';


dotenv.config();

const app = express();
const PORT= process.env.PORT || 5001;


// Middleware to parse JSON bodies
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend's origin
}));
app.use(express.json());
app.use(rateLimiter);

// simple custom middleware to log request method and url
/*app.use((req, res, next) => {
  console.log(`Request Method: ${req.method} \nRequest URL: ${req.url}`);
  next();
});*/

app.use("/api/notes", notesRoutes);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});


