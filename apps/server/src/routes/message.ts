import { Router, Response } from 'express';                                                                                                                                           
import { getMessagesByChannelId } from '../models/messageModel';                                                                                                                      
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
                                                                                                                                                                                    
export default router; 