import { Router } from 'express';
import * as ChannelController from '../controllers/channelController';
import { requireAuth } from '../middleware/requireAuth'; // need this to allow post and delete to utilize AuthUser instead of regular Request

const router = Router();
router.get('/official', ChannelController.getOfficialChannels);
router.get('/all', requireAuth, ChannelController.getAllChannels);
router.get('/nearby', requireAuth, ChannelController.getNearbyChannels);

// Get all non-admin users (for add-member picker) — must be before /:id to avoid conflict
router.get('/users/all', requireAuth, ChannelController.getAllUsers);

router.get('/:id', ChannelController.getChannelById);
router.post('/', requireAuth, ChannelController.createChannel);
router.delete('/:id', requireAuth, ChannelController.deleteChannel);

// Channel member management
router.get('/:id/members', requireAuth, ChannelController.getChannelMembers);
router.post('/:id/members', requireAuth, ChannelController.addChannelMember);
router.delete('/:id/members/:userId', requireAuth, ChannelController.removeChannelMember);

// Channel participants (users who have sent messages)
router.get('/:id/participants', requireAuth, ChannelController.getChannelParticipants);

export default router;
