import express from 'express'
import { chatmessages, saveChatMessage } from '../controllers/chatController.js'
 const chatRouter = express.Router();
 chatRouter.post('/messages',chatmessages)
 chatRouter.post('/save',saveChatMessage)
 export default chatRouter