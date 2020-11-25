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
const playlist_api_1 = __importDefault(require("../youtube-api/playlist-api"));
const mocks_1 = __importDefault(require("../mocks/mocks"));
const video_api_1 = __importDefault(require("../youtube-api/video-api"));
describe('YouTube functions', () => {
    it('should convert a playlist into a broadcast', () => __awaiter(void 0, void 0, void 0, function* () {
        const outcome = yield playlist_api_1.default(false, mocks_1.default.mockUser1.youtubePlaylists);
        expect(outcome).toBeTruthy;
    }));
    it('should store a video in the database, if it does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockArray = ['d36pOT8NaUA', 'PIHN5pp-mUg'];
        const outcome = yield video_api_1.default(mockArray);
        expect(outcome).toBeTruthy;
    }));
    it('should return false if video is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockArray = 'not an array of strings';
        const outcome = yield video_api_1.default(mockArray);
        expect(outcome).toBe(false);
    }));
});
//# sourceMappingURL=youtube.js.map