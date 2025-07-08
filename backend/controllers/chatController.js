import MessageModel from '../models/messageModel.js';
const chatmessages = async (req, res) => {
    try {
         const { appointmentId } = req.body;
    const messages = await MessageModel.find({ appointmentId }).sort({ timestamp: 1 });
    res.json({ success: true, messages });
    } catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
}

// API to save chat messages
const saveChatMessage = async (req, res) => {
    try {
    const { appointmentId, message, senderId, timestamp } = req.body

    if (!appointmentId || !message || !senderId || !timestamp) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    const saved = await MessageModel.create({ appointmentId, message, senderId, timestamp })

    res.json({ success: true, saved })
  } catch (error) {
    console.error('Error saving chat message:', error);
  res.status(500).json({ success: false, message: error.message });
}
}
// Upload chat image to Cloudinary
const uploadChatImage = async (req, res) => {
  try {
    console.log(" File received:", JSON.stringify(req.file, null, 2))  //  Clear log

    if (!req.file || !req.file.path) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    res.json({ success: true, url: req.file.path })
  } catch (error) {
    console.error("🔥 Upload Error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}


        
export { chatmessages ,saveChatMessage,uploadChatImage};