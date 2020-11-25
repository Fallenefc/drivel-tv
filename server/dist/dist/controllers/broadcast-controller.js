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
/* eslint-disable no-console */
// Import CRON-like module for broadcast timestamp scheduling
const node_schedule_1 = __importDefault(require("node-schedule"));
const Broadcast_model_1 = __importDefault(require("../models/Broadcast-model"));
// Import functions that uses YouTube API to get relevant data
const playlist_api_1 = __importDefault(require("../youtube-api/playlist-api"));
const find_api_1 = __importDefault(require("../youtube-api/find-api"));
// Import CRON script
const cron_1 = __importDefault(require("../cron/cron"));
// Get all broadcast objects
const getAllBroadcast = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Find all broadcast objects and send back to client
    Broadcast_model_1.default.find({}, (__, broadcasts) => {
        if (broadcasts === null)
            res.status(404).send('404'); // If not found, send 404
        else
            res.status(200).json(broadcasts); // Else if found, send broadcast obj back
    });
});
// Get broadcast object
const getBroadcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get broadcast id from request
    const broadId = req.body.broadcastId;
    // Find specific broadcast object and send back to client
    Broadcast_model_1.default.findOne({ broadcastId: broadId }, (_, broadcast) => {
        if (broadcast === null)
            res.status(404).send('404'); // If not found, send 404
        else
            res.status(200).json(broadcast); // Else if found, send broadcast obj back
    });
});
// Create broadcast function
const createBroadcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destruct client request data
        const { title, description, tags, owner, isReversed, youtubePlaylists, } = req.body;
        // Run client data through our YouTube API helper function and return relevant data
        const { broadcastId, thumbnailUrl, youtubePlaylistIds, videoArray, currentVideo, nextVideo, } = yield playlist_api_1.default(isReversed, youtubePlaylists);
        // eslint-disable-next-line max-len
        // Return full video object from DB to access length property (video duration - see Broadcast.create below)
        const currentVid = yield find_api_1.default(currentVideo);
        const nextVid = yield find_api_1.default(nextVideo);
        // Store broadcast data in object
        const broadcastObj = {
            broadcastId,
            title,
            description,
            tags,
            thumbnailUrl,
            owner,
            isReversed,
            youtubePlaylists: youtubePlaylistIds,
            videoArray,
            currentVideo,
            currentVideoLength: (currentVid === null || currentVid === void 0 ? void 0 : currentVid.length) || 0,
            currentTime: 0,
            nextVideo,
            nextVideoLength: (nextVid === null || nextVid === void 0 ? void 0 : nextVid.length) || 0,
        };
        // Store broadcast in DB using Mongoose
        yield Broadcast_model_1.default.create(broadcastObj);
        // Start CRON timer (update broadcast every second)
        cron_1.default(broadcastId);
        // Send broadcast back to client
        res.status(200).json(broadcastObj);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});
// Delete broadcast function
const deleteBroadcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete broadcast from DB using Mongoose
        yield Broadcast_model_1.default.deleteOne({ broadcastId: req.body.broadcastId });
        // TO DO - CHANGE TO URL PARAMETER - Get broadcast id from client
        const { broadcastId } = req.body;
        // If broadcast id exists, delete broadcast - else, throw error
        if (node_schedule_1.default.scheduledJobs[broadcastId]) {
            const currentBroadcast = node_schedule_1.default.scheduledJobs[broadcastId];
            currentBroadcast.cancel();
            res.status(200).send(broadcastId);
        }
        else {
            throw new Error('Broadcast id does not exist');
        }
    }
    catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});
exports.default = {
    getAllBroadcast,
    getBroadcast,
    createBroadcast,
    deleteBroadcast,
};
//# sourceMappingURL=broadcast-controller.js.map