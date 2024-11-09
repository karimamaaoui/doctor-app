const Notification = require("../models/Notification.js");
const mongoose = require('mongoose');

const addNewNotification = async(req ,res)=>{
    

        const {recipientId , senderId , appointmentId, type , message } = req.body;

        if (!mongoose.Types.ObjectId.isValid(appointmentId) ||
        !mongoose.Types.ObjectId.isValid(recipientId) ||
        !mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ error: 'Invalid appointment ID' });
          }

          if (!type || !message) {
            return res.status(400).json({ error: 'type and message are required' });
          }
          

          const notification = new Notification({
            recipientId , 
            senderId , 
            appointmentId,
             type ,
             message
          });


         const newNotification= await notification.save();

         console.log("0000000000000000000000",notification)

        // Envoyer la notification via WebSocket ou autre méthode
        req.io.to(recipientId.toString()).emit('newNotification', newNotification);
        res.status(201).json(notification);
    
}

const getNotificationsForUserNotSeen = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const notifications = await Notification.find({ recipientId: userId  , seen :false}).sort({ timestamp: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des notifications.', error });
    }
}
const markNotificationAsSeen = async (req, res) => {
  try {
    await Notification.updateMany({ recipientId: req.params.id, seen: false }, { seen: true });
    res.status(200).json({ message: 'All notifications marked as seen' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as seen', error });
  }
  };
const getAllNotificationUserID= async (req,res)=>{
  const { userId } = req.params;
  
  try {
    const notifications = await Notification.find({ recipientId: userId }).sort({ timestamp: -1 })
    .populate('senderId').exec();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications.', error });
  }
}

const deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete all notifications for the user
    await Notification.deleteMany({ recipientId: userId });

    res.status(200).json({ message: 'All notifications have been deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications.', error });
  }
};

const getRecentNotifications = async (req , res)=>{
  try {
    const userId = req.params.userId; // ID de l'utilisateur pour qui nous récupérons les notifications

    const notifications = await Notification.find({ recipientId: userId })
      .sort({ timestamp: -1 }) // Trier par date, du plus récent au plus ancien
      .limit(5); // Limiter à 5 notifications

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server Error' });
  }
}


module.exports ={
    addNewNotification,
    getNotificationsForUserNotSeen,
    markNotificationAsSeen,
    getAllNotificationUserID,
    deleteAllNotifications,
    getRecentNotifications
} 