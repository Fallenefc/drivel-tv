/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable array-callback-return */
import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { UserInterface } from '../models/User-model';
import mocks from '../mocks/usersMock';
/* eslint-disable no-undef */
import testedServer from '../server'; // if it breaks, import from dist

// const { SECRET_KEY } = process.env;

describe('Session Server:', () => {
  const User = mongoose.connection.model('User');
  // let token: string;

  afterEach(async () => {
    try {
      await mongoose.connection.dropCollection('users');
      return true;
    } catch (error) {
      return false;
    }
  });

  afterAll(async () => {
    testedServer.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('Resgistering New User (Endpoint "/signup"):', () => {
    it('should create a new user', (done) => {
      request(testedServer)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(mocks.mockUser1)
        .expect(201)
        .end(() => {
          User.find((_: Error, users: UserInterface[]) => {
            expect(users.length).toBe(1);
            done();
          });
        });
    });

    it('should store a bcrypt hashed password', (done) => {
      request(testedServer)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(mocks.mockUser1)
        .end(() => {
          User.find((err, users: UserInterface[]) => {
            expect(users[0].password).not.toBe(mocks.mockUser1.password);
            expect(bcrypt.compareSync(mocks.mockUser1.password, users[0].password)).toBe(true);
            done();
          });
        });
    });

    it('should return an error when creating a user without an username', (done) => {
      request(testedServer)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser1)
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        })
        .end(done);
    });

    it('should return an error when creating a user without a password', (done) => {
      request(testedServer)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser2)
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        })
        .end(done);
    });

    it('should return an error when creating a user without an email', (done) => {
      request(testedServer)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser3)
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        })
        .end(done);
    });

    it('Should not create the same user twice', (done) => {
      User.create(mocks.mockUser1).then(() => {
        request(testedServer)
          .post('/signup')
          .set('Content-Type', 'application/json')
          .send(mocks.mockUser1)
          .expect((res) => {
            expect(res.status).toBeGreaterThanOrEqual(400);
          })
          .end(() => {
            User.find((_, users) => {
              expect(users.length).toBe(1);
              done();
            });
          });
      });
    });
  });
  describe('Endpoint "/login":', () => {
    beforeEach(async () => {
      const hash = await bcrypt.hash(mocks.mockUser1.password, 10);
      await User.create({ ...mocks.mockUser1, password: hash });
    });

    it('should accept an username & password and return the user object', (done) => {
      request(testedServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ username: mocks.mockUser1.username, password: mocks.mockUser1.password })
        .expect(200)
        .end(done);
    });

    it('should return an error when trying to login with the wrong credentials', (done) => {
      request(testedServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ username: mocks.mockUser1.username, password: mocks.mockUser2.password })
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        })
        .end(done);
    });

    it('should return an error when missing the username', (done) => {
      request(testedServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ username: '', password: mocks.mockUser1.password })
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        })
        .end(done);
    });

    it('should return an error when missing the password', (done) => {
      request(testedServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ username: mocks.mockUser1.username, password: '' })
        .expect((res) => {
          expect(res.status).toBeGreaterThanOrEqual(400);
        })
        .end(done);
    });

    // it('should return a valid access token on successful login', (done) => {
    //   request(testedServer)
    //     .post('/login')
    //     .set('Content-Type', 'application/json')
    //     .send({ email: mocks.mockUser1.email, password: mocks.mockUser1.password })
    //     .expect(200)
    //     .expect((res) => {
    //       token = res.body.accessToken;
    //     })
    //     .end(() => {
    //       User.find((err, users) => {
    //         // eslint-disable-next-line no-underscore-dangle
    //         const userId = String(users[0]._id);
    //         // eslint-disable-next-line no-underscore-dangle
    //         expect(jwt.verify(token, SECRET_KEY)._id).toBe(userId);
    //         done();
    //       });
    //     });
    // });
  });
});
