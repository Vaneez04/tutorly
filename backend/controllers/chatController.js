import MessageModel from '../models/messagemodel.js';
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
        
export { chatmessages ,saveChatMessage};