import express from 'express';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import './db/connect';
import path from 'path';
import routes from './routes/index';

dotenv.config({ path: path.join(__dirname, './.env') });

// Middleware
const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(
  session({
    secret: process.env.SESSION_KEY || '',
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(4000, () => {
  console.log('Server is on');
});
