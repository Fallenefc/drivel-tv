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
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const mongoose_1 = __importDefault(require("mongoose"));
const Message_model_1 = __importDefault(require("../models/Message-model"));
const mocks_1 = __importDefault(require("../mocks/mocks"));
let socket;
const MONGO_DB = 'mongodb://localhost:27017/driveltv';
describe('socket.io testing', () => {
    beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        socket = socket_io_client_1.default('http://localhost:4000', { transports: ['websocket'] });
        socket.emit('join', mocks_1.default.mockRoom);
        yield mongoose_1.default.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        done();
    }));
    afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.connection.close();
        done();
    }));
    it('Client should create message (and store in DB) when the message is emitted', (done) => __awaiter(void 0, void 0, void 0, function* () {
        socket.emit('chat message to server', mocks_1.default.mockMessage);
        const msg = yield Message_model_1.default.find();
        expect(msg).toBeTruthy;
        done();
    }));
});
//# sourceMappingURL=socket.spec.js.map