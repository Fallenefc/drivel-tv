"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import dependencies
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const socket_io_1 = require("socket.io");
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./router"));
const cron_startup_1 = __importDefault(require("./cron/cron-startup"));
const broadcast_socket_1 = __importDefault(require("./socket/broadcast-socket"));
dotenv.config();
const { MONGO_DB, PORT } = process.env;
const app = express_1.default();
const server = new http.Server(app);
const io = new socket_io_1.Server(server);
// Call io module with io instance
broadcast_socket_1.default(io);
// If app is in dev mode, replace process.env variables with variables in .env file
if (process.env.NODE_ENV !== 'production')
    dotenv.config();
// Parse API requests as JSON
app.use(express_1.default.json());
// For api requests, rout them through router files
app.use(router_1.default);
// Serve static files (index.html) from from build folder
app.use(express_1.default.static(path.join(__dirname, 'client/public')));
// Leverage React routing, return requests to React
app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
}
// Connect to MongoDB and listen for new requests
const expressServer = server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGO_DB || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        // Function that finds all broadcasts in DB and start their timers
        yield cron_startup_1.default();
        console.log(`Drivel server connected to DB - listening on port: ${process.env.PORT}`);
    }
    catch (error) {
        console.log('Could not connect to database', error); // eslint-disable-line no-console
    }
}));
exports.default = expressServer;
//# sourceMappingURL=server.js.map