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
/* eslint-disable max-len */
// Import fetch and modules to manipulate URLs
const node_fetch_1 = __importDefault(require("node-fetch"));
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
const nanoid_1 = require("nanoid");
const video_api_1 = __importDefault(require("./video-api"));
// Function that processes playlists using YouTube API
const convertPlaylist = (isReversed, youtubePlaylists) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Variable to save playlist thumbnail url
        let imageUrl = 'No thumbnail';
        // Get all YouTube video ids from playlists
        const getVidIds = (playlists) => __awaiter(void 0, void 0, void 0, function* () {
            // Return array of video ids from each playlist URL
            const playlistVideoArray = yield Promise.all(playlists.map((playlistUrl) => __awaiter(void 0, void 0, void 0, function* () {
                const parsedUrl = url_1.default.parse(playlistUrl);
                // Parse playlist URL to get playlist id
                const parsedQs = querystring_1.default.parse(parsedUrl.query || '');
                // Call YouTube API to get all Ids
                const response = yield node_fetch_1.default(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&playlistId=${parsedQs.list}&key=${process.env.YT_API_KEY}`);
                const youtubeJSON = yield response.json();
                const array = yield youtubeJSON.items.map((video) => video.snippet.resourceId.videoId);
                // Save first video thumbnail as playlist thumbnail
                // If thumbnail resolution does not exist, use the next available size
                if (youtubeJSON.items[0].snippet.thumbnails.maxres)
                    imageUrl = youtubeJSON.items[0].snippet.thumbnails.maxres.url;
                else if (youtubeJSON.items[0].snippet.thumbnails.standard)
                    imageUrl = youtubeJSON.items[0].snippet.thumbnails.standard.url;
                else if (youtubeJSON.items[0].snippet.thumbnails.high)
                    imageUrl = youtubeJSON.items[0].snippet.thumbnails.high.url;
                // Return array of ids
                return array;
            })));
            // Return array of arrays containing video ids
            return playlistVideoArray.flat();
        });
        // Convert playlist string to array of playlists and remove whitespace
        const escapedyoutubePlaylists = youtubePlaylists.replace(/\s/g, '').split(',');
        // Get video array
        const playlistVideoArray = yield getVidIds(escapedyoutubePlaylists);
        // Flatten the array of arrays, generating a complete list of video ids
        const flattenedVideoArray = [].concat(...playlistVideoArray);
        // Return if no videos in array
        if (flattenedVideoArray.length < 2)
            return;
        // Reverse video-order per user setting
        if (isReversed === true)
            flattenedVideoArray.reverse();
        // Store all YouTube videos in DB
        yield video_api_1.default(flattenedVideoArray);
        // Crate new unique broadcast id
        const id = nanoid_1.nanoid();
        // Save relevant data in broadcast object
        const broadcast = {
            broadcastId: id,
            thumbnailUrl: imageUrl,
            youtubePlaylistIds: escapedyoutubePlaylists,
            videoArray: flattenedVideoArray,
            currentVideo: flattenedVideoArray[0],
            nextVideo: flattenedVideoArray[1],
        };
        // Return broadcast object
        // eslint-disable-next-line consistent-return
        return broadcast;
    }
    catch (error) {
        console.log('Problem processing playlists using YouTube API', error);
    }
});
exports.default = convertPlaylist;
//# sourceMappingURL=playlist-api.js.map