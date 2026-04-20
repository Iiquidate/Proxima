import { Router } from 'express';
import * as ChannelController from '../controllers/channelController';
import { requireAuth } from '../middleware/requireAuth'; // need this to allow post and delete to utilize AuthUser instead of regular Request

const router = Router();
router.get('/official', ChannelController.getOfficialChannels);
router.get('/all', ChannelController.getAllChannels);
router.get('/nearby', ChannelController.getNearbyChannels);
router.get('/:id', ChannelController.getChannelById);
router.post('/', requireAuth, ChannelController.createChannel);
router.delete('/:id', requireAuth, ChannelController.deleteChannel);

export default router;
