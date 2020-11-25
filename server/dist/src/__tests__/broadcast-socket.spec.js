"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
// Import dependencies
// import express from 'express';
const socket_io_1 = require("socket.io");
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const http_1 = __importDefault(require("http"));
const timers_1 = require("timers");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env.test'),
});
const ioOptions = {
    transports: ['websocket'],
    forceNew: true,
    reconnection: false,
};
// const test = io(http);
describe('socket.io testing', () => {
    let sender;
    let receiver;
    let httpServer;
    let ioServer;
    beforeAll((done) => {
        httpServer = new http_1.default.Server().listen(5000);
        ioServer = new socket_io_1.Server(httpServer);
        ioServer.on('connection', (socket) => {
            socket.on('message', (data) => {
                socket.broadcast.emit('message', data);
            });
            timers_1.setTimeout(() => {
                socket.emit('push', 'mock content');
            }, 200);
        });
        done();
    });
    beforeEach((done) => {
        sender = socket_io_client_1.default('http://localhost:5000/', ioOptions);
        receiver = socket_io_client_1.default('http://localhost:5000/', ioOptions);
        sender.on('connect', done);
        receiver.on('connect', done);
    });
    afterEach((done) => {
        sender.disconnect();
        receiver.disconnect();
        done();
    });
    afterAll(() => {
        httpServer.close();
        ioServer.close();
    });
    describe('Message Events', () => {
        it('Clients should receive a message when the `message` event is emited.', (done) => {
            sender.emit('message', 'Hello World');
            receiver.on('message', (msg) => {
                expect(msg).toBe('Hello World');
                done();
            });
        });
        it('Emit messages from the server', (done) => {
            let count = 0;
            receiver.on('push', (msg) => {
                expect(msg).toBe('mock content');
                count += 1;
            });
            sender.on('push', (msg) => {
                expect(msg).toBe('mock content');
                count += 1;
            });
            timers_1.setTimeout(() => {
                expect(count).toBe(2);
                done();
            }, 2000);
        });
    });
});
//# sourceMappingURL=broadcast-socket.spec.js.map