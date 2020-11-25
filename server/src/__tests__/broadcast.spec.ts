/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
import request from 'supertest';
import BroadcastModel from '../models/Broadcast-model';
import mocks from '../mocks/mocks';

import expressServer from '../server';

describe('Broadcast endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  let broadcastId: string;

  it('should add a broadcast', async (done) => {
    const response: any = await request(expressServer)
      .post('/api/create-broadcast')
      .set('Content-Type', 'application/json')
      .send(mocks.mockUser1)
      .expect(200);
    expect(response.body.broadcastId).toBeTruthy;
    let test;
    setTimeout(async () => {
      test = await BroadcastModel.find({ broadcastId });
      expect(test).toBeTruthy;
      done();
    }, 1000);
    broadcastId = response.body.broadcastId;
  });

  it('should be able to get the added broadcast', async () => {
    const response = await request(expressServer)
      .post('/api/get-broadcast')
      .set('Content-Type', 'application/json')
      .send({ broadcastId })
      .expect(200);
    expect(response).toBeTruthy;
  });

  it('should successfully grab all broadcasts', async () => {
    const response = await request(expressServer)
      .get('/api/get-all-broadcasts')
      .expect(200);
    expect(response).toBeTruthy;
  });

  it('should not be able to get the added broadcast, if does not exist', async () => {
    await request(expressServer)
      .post('/api/get-broadcast')
      .set('Content-Type', 'application/json')
      .send({
        broadcastId: 'doggoandcatto',
      })
      .expect(404);
  });

  it('should be able to delete a broadcast, if it exists', async () => {
    await request(expressServer)
      .delete('/api/delete-broadcast')
      .send({
        broadcastId,
      })
      .expect(200);
    const mongooseDeletedBroadcast = await BroadcastModel.find({ broadcastId });
    expect(mongooseDeletedBroadcast.length).toBe(0);
  });

  it('should be not able to delete a broadcast, if it does not exists', async () => {
    await request(expressServer)
      .delete('/api/delete-broadcast')
      .send({
        broadcastId: 'doggosarebetterthancattos',
      })
      .expect(400);
  });
});
