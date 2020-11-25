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
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const Broadcast_model_1 = __importDefault(require("../models/Broadcast-model"));
const mocks_1 = __importDefault(require("../mocks/mocks"));
const server_1 = __importDefault(require("../server"));
describe('Broadcast endpoints', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
    }));
    let broadcastId;
    it('should add a broadcast', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default)
            .post('/api/create-broadcast')
            .set('Content-Type', 'application/json')
            .send(mocks_1.default.mockUser1)
            .expect(200);
        expect(response.body.broadcastId).toBeTruthy;
        let test;
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            test = yield Broadcast_model_1.default.find({ broadcastId });
            expect(test).toBeTruthy;
            done();
        }), 1000);
        broadcastId = response.body.broadcastId;
    }));
    it('should be able to get the added broadcast', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default)
            .post('/api/get-broadcast')
            .set('Content-Type', 'application/json')
            .send({ broadcastId })
            .expect(200);
        expect(response).toBeTruthy;
    }));
    it('should successfully grab all broadcasts', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(server_1.default)
            .get('/api/get-all-broadcasts')
            .expect(200);
        expect(response).toBeTruthy;
    }));
    it('should not be able to get the added broadcast, if does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(server_1.default)
            .post('/api/get-broadcast')
            .set('Content-Type', 'application/json')
            .send({
            broadcastId: 'doggoandcatto',
        })
            .expect(404);
    }));
    it('should be able to delete a broadcast, if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(server_1.default)
            .delete('/api/delete-broadcast')
            .send({
            broadcastId,
        })
            .expect(200);
        const mongooseDeletedBroadcast = yield Broadcast_model_1.default.find({ broadcastId });
        expect(mongooseDeletedBroadcast.length).toBe(0);
    }));
    it('should be not able to delete a broadcast, if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(server_1.default)
            .delete('/api/delete-broadcast')
            .send({
            broadcastId: 'doggosarebetterthancattos',
        })
            .expect(400);
    }));
});
//# sourceMappingURL=broadcast.spec.js.map