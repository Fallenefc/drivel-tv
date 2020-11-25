"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable array-callback-return */
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const usersMock_1 = __importDefault(require("../mocks/usersMock"));
/* eslint-disable no-undef */
const server_1 = __importDefault(require("../../dist/server")); // if it breaks, import from dist
// const { SECRET_KEY } = process.env;
describe('Session Server:', () => {
    const User = mongoose_1.default.connection.model('User');
    // let token: string;
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connection.dropCollection('users');
            return true;
        }
        catch (error) {
            return false;
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        server_1.default.close();
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.disconnect();
    }));
    describe('Resgistering New User (Endpoint "/signup"):', () => {
        it('should create a new user', (done) => {
            supertest_1.default(server_1.default)
                .post('/signup')
                .set('Content-Type', 'application/json')
                .send(usersMock_1.default.mockUser1)
                .expect(201)
                .end(() => {
                User.find((_, users) => {
                    expect(users.length).toBe(1);
                    done();
                });
            });
        });
        it('should store a bcrypt hashed password', (done) => {
            supertest_1.default(server_1.default)
                .post('/signup')
                .set('Content-Type', 'application/json')
                .send(usersMock_1.default.mockUser1)
                .end(() => {
                User.find((err, users) => {
                    expect(users[0].password).not.toBe(usersMock_1.default.mockUser1.password);
                    expect(bcrypt_1.default.compareSync(usersMock_1.default.mockUser1.password, users[0].password)).toBe(true);
                    done();
                });
            });
        });
        it('should return an error when creating a user without an username', (done) => {
            supertest_1.default(server_1.default)
                .post('/signup')
                .set('Content-Type', 'application/json')
                .send(usersMock_1.default.mockIncompleteUser1)
                .expect((res) => {
                expect(res.status).toBeGreaterThanOrEqual(400);
            })
                .end(done);
        });
        it('should return an error when creating a user without a password', (done) => {
            supertest_1.default(server_1.default)
                .post('/signup')
                .set('Content-Type', 'application/json')
                .send(usersMock_1.default.mockIncompleteUser2)
                .expect((res) => {
                expect(res.status).toBeGreaterThanOrEqual(400);
            })
                .end(done);
        });
        it('should return an error when creating a user without an email', (done) => {
            supertest_1.default(server_1.default)
                .post('/signup')
                .set('Content-Type', 'application/json')
                .send(usersMock_1.default.mockIncompleteUser3)
                .expect((res) => {
                expect(res.status).toBeGreaterThanOrEqual(400);
            })
                .end(done);
        });
        it('Should not create the same user twice', (done) => {
            User.create(usersMock_1.default.mockUser1).then(() => {
                supertest_1.default(server_1.default)
                    .post('/signup')
                    .set('Content-Type', 'application/json')
                    .send(usersMock_1.default.mockUser1)
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
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            const hash = yield bcrypt_1.default.hash(usersMock_1.default.mockUser1.password, 10);
            yield User.create(Object.assign(Object.assign({}, usersMock_1.default.mockUser1), { password: hash }));
        }));
        it('should accept an username & password and return the user object', (done) => {
            supertest_1.default(server_1.default)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ username: usersMock_1.default.mockUser1.username, password: usersMock_1.default.mockUser1.password })
                .expect(200)
                .end(done);
        });
        it('should return an error when trying to login with the wrong credentials', (done) => {
            supertest_1.default(server_1.default)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ username: usersMock_1.default.mockUser1.username, password: usersMock_1.default.mockUser2.password })
                .expect((res) => {
                expect(res.status).toBeGreaterThanOrEqual(400);
            })
                .end(done);
        });
        it('should return an error when missing the username', (done) => {
            supertest_1.default(server_1.default)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ username: '', password: usersMock_1.default.mockUser1.password })
                .expect((res) => {
                expect(res.status).toBeGreaterThanOrEqual(400);
            })
                .end(done);
        });
        it('should return an error when missing the password', (done) => {
            supertest_1.default(server_1.default)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({ username: usersMock_1.default.mockUser1.username, password: '' })
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
//# sourceMappingURL=users.spec.js.map