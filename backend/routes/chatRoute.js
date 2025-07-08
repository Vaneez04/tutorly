import express from 'express'
import upload from '../middlewares/multer.js';
import { chatmessages, saveChatMessage,uploadChatImage } from '../controllers/chatController.js'
 const chatRouter = express.Router();
 chatRouter.post('/messages',chatmessages)
 chatRouter.post('/save',saveChatMessage)
 chatRouter.post('/upload', upload.single('file'), uploadChatImage)  //  Cloudinary upload route
 export default chatRouter