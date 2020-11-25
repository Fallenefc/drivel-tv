/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import io from 'socket.io-client';
import mongoose from 'mongoose';
import MessageModel from '../models/Message-model';
import mocks from '../mocks/mocks';

let socket: any;
const MONGO_DB = 'mongodb://localhost:27017/driveltv';

describe('socket.io testing', () => {
  beforeAll(async (done) => {
    socket = io('http://localhost:4000', { transports: ['websocket'] });
    socket.emit('join', mocks.mockRoom);
    await mongoose.connect(MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    done();
  });

  afterAll(async (done) => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    done();
  });

  it('Client should create message (and store in DB) when the message is emitted', async (done) => {
    socket.emit('chat message to server', mocks.mockMessage);
    const msg: any = await MessageModel.find();
    expect(msg).toBeTruthy;
    done();
  });
});
