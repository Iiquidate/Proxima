import { Router, Response } from 'express';                                                                                                                                           
import { getMessagesByChannelId, deleteMessage } from '../models/messageModel';                                                                                                                      
import { requireAuth, AuthenticatedRequest } from '../middleware/requireAuth';                                                                                                        
                                                                                                                                                                                    
const router = Router();                                                                                                                                                              
                                                                                                                                                                                    
router.get('/:channelId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {                                                                                        
    try {
        const { channelId } = req.params as { channelId: string };
        const messages = await getMessagesByChannelId(channelId);                                                                                                                     
        res.json(messages);
    } catch (err) {                                                                                                                                                                   
        console.error('Failed to fetch messages:', err);                                                                                                                            
        res.status(500).json({ error: 'Failed to fetch messages' });
    }                                                                                                                                                                                 
});

router.delete('/:messageId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { messageId } = req.params as { messageId: string };

        if (req.AuthUser?.role !== 'admin') {
            return res.status(403).json({ error: 'Only admins can delete messages' });
        }

        const deleted = await deleteMessage(messageId);

        if (!deleted) {
            return res.status(404).json({ error: 'Message not found' });
        }

        return res.status(200).json({ message: 'Message deleted successfully', deletedMessageId: messageId });
    } catch (err) {
        console.error('Failed to delete message:', err);
        return res.status(500).json({ error: 'Failed to delete message' });
    }
});
                                                                                                                                                                                    
export default router; 