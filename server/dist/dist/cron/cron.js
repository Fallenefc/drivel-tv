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
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
// Import CRON-like module for broadcast timestamp scheduling
const node_schedule_1 = __importDefault(require("node-schedule"));
// Import moment to decode YouTube timestamp
const moment = __importStar(require("moment"));
const moment_duration_format_1 = __importDefault(require("moment-duration-format"));
const Broadcast_model_1 = __importDefault(require("../models/Broadcast-model"));
const Video_model_1 = __importDefault(require("../models/Video-model"));
moment_duration_format_1.default(moment);
// Start timer that updates broadcast every second
const startCron = (broadcastId) => {
    // If broadcast id does not exist, start broadcast - else, throw error
    if (!node_schedule_1.default.scheduledJobs[broadcastId]) {
        node_schedule_1.default.scheduleJob(broadcastId, '* * * * * *', () => {
            Broadcast_model_1.default.findOne({ broadcastId }, (err, broadcast) => __awaiter(void 0, void 0, void 0, function* () {
                if (err)
                    throw new Error(`Could not find broadcast in DB! ${err}`);
                // Convert YouTube timestamp to seconds (and remove commas produced by moment plugin)
                const length = Number(moment.duration(broadcast.currentVideoLength).format('ss').replace(/,/g, ''));
                // If current timestamp is less than video duration, increment with 1 second
                if (broadcast.currentTime < length) {
                    // console.log('++', broadcast.broadcastId);
                    // Server-log to verify if broadcast timers are on
                    broadcast.currentTime = ++broadcast.currentTime; // Increment timestamp by 1
                    broadcast.save(); // Save to DB
                }
                else {
                    // If video has finished playing,
                    // shift current video to the back of the queue and update video & timestamp data
                    const newVideoArray = broadcast.videoArray;
                    newVideoArray.push(newVideoArray.shift()); // Shift queue
                    // Find video length of next video in queue
                    const nextLength = yield Video_model_1.default.findOne({ youtubeId: newVideoArray[1] }, (err) => {
                        if (err)
                            throw new Error(`Could not find next video in DB! ${err}`);
                    });
                    // Update broadcast object
                    broadcast.videoArray = newVideoArray; // Set shifted queue as new array of videos
                    broadcast.currentVideo = newVideoArray[0]; // Set new beginning of queue as first video
                    broadcast.currentVideoLength = broadcast.nextVideoLength; // Set next video's length as current length
                    broadcast.currentTime = 0; // Reset timestamp
                    broadcast.nextVideo = newVideoArray[1]; // Set new next vide
                    broadcast.nextVideoLength = nextLength.length; // Set next video length using value fetched from DB
                    broadcast.save(); // Save to DB
                }
            }));
        });
    }
    else {
        throw new Error('Broadcast id already exists');
    }
};
exports.default = startCron;
//# sourceMappingURL=cron.js.map