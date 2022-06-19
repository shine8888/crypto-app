import mongoose from 'mongoose';

mongoose.Promise = Promise;

// Connect to cluster in mongo atlas
mongoose.connect(
  'mongodb+srv://admin:admin123@cluster0.uifxm.mongodb.net/test',
  (err: Error) => {
    if (err) throw err;
    console.log('Connected to Mongo');
  },
);

const conn = mongoose.connection;

// Conection error
conn.on('error', () => console.error.bind(console, 'connection error'));

// Open connection
conn.once('open', () => console.info('Connection to Database is successful'));

export default mongoose;
