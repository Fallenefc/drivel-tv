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
Object.defineProperty(exports, "__esModule", { value: true });
// Require mongoose
const mongoose_1 = __importStar(require("mongoose"));
// Create new Broadcast schema
const BroadcastModelSchema = new mongoose_1.Schema({
    broadcastId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    tags: String,
    thumbnailUrl: { type: String, required: true },
    owner: { type: String, required: true },
    isReversed: { type: Boolean, required: true },
    youtubePlaylists: { type: Array, required: true },
    videoArray: { type: Array, required: true },
    currentVideo: { type: String, required: true },
    currentVideoLength: { type: String, required: true },
    currentTime: { type: Number, required: true },
    nextVideo: { type: String, required: true },
    nextVideoLength: { type: String, required: true },
}, { timestamps: true }); // Set automatic timestamp for every document
exports.default = mongoose_1.default.model('Broadcast', BroadcastModelSchema);
//# sourceMappingURL=Broadcast-model.js.map