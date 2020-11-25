// Import dependencies
import express, { Response } from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import * as path from 'path';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router';
import startAllCron from './cron/cron-startup';
import broadcastSocket from './socket/broadcast-socket';

dotenv.config();
const { MONGO_DB, PORT } = process.env;

const app = express();
const server = new http.Server(app);
const io = new Server(server);

// Call io module with io instance
broadcastSocket(io);

// If app is in dev mode, replace process.env variables with variables in .env file
if (process.env.NODE_ENV !== 'production') dotenv.config();

// Parse API requests as JSON
app.use(express.json());
// For api requests, rout them through router files
app.use(router);

// Serve static files (index.html) from from build folder
app.use(express.static(path.join(__dirname, 'client/public')));
// Leverage React routing, return requests to React
app.get('*', (_, res: Response) => {
  res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
}

// Connect to MongoDB and listen for new requests
const expressServer = server.listen(PORT, async () => {
  try {
    await mongoose.connect(MONGO_DB || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    // Function that finds all broadcasts in DB and start their timers
    await startAllCron();
    console.log(`Drivel server connected to DB - listening on port: ${process.env.PORT}`);
  } catch (error) {
    console.log('Could not connect to database', error); // eslint-disable-line no-console
  }
});

export default expressServer;
