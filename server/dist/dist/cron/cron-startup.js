"use strict";
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
const cron_1 = __importDefault(require("./cron"));
const Broadcast_model_1 = __importDefault(require("../models/Broadcast-model"));
// Function that finds all broadcasts and start their timers
const startAllCron = () => __awaiter(void 0, void 0, void 0, function* () {
    // Find all broadcasts in DB using Mongoose
    yield Broadcast_model_1.default.find({}, (err, broadcasts) => {
        // For each broadcast, start a corresponding timer
        broadcasts.forEach((broadcast) => {
            cron_1.default(broadcast.broadcastId);
        });
    });
});
exports.default = startAllCron;
//# sourceMappingURL=cron-startup.js.map