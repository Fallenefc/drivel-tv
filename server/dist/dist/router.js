"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import express router
const express_1 = require("express");
const broadcast_controller_1 = __importDefault(require("./controllers/broadcast-controller"));
const router = express_1.Router();
// Route to get all broadcasts
router.get('/api/get-all-broadcasts', broadcast_controller_1.default.getAllBroadcast);
// Route to get broadcast page (by client POSTing id to identify broadcast)
router.post('/api/get-broadcast', broadcast_controller_1.default.getBroadcast);
// Route to create a new broadcast
router.post('/api/create-broadcast', broadcast_controller_1.default.createBroadcast);
// Route to delete a broadcast
router.delete('/api/delete-broadcast', broadcast_controller_1.default.deleteBroadcast);
exports.default = router;
//# sourceMappingURL=router.js.map