import { Request, Response } from 'express';
import * as ChannelModel from '../models/channelModel';
import {AuthenticatedRequest} from '../middleware/requireAuth'; // only need AuthenticatedRequest from the middleware, since it's the interface

export const getOfficialChannels = async (req: Request, res: Response) => {
    try {
        const official = await ChannelModel.getOfficialChannels();
        // Returns the official channels and the count of them
        return res.json({
            officialChannels: official || [],
            count: (official?.length || 0)
        });
    } catch (error) {
        console.error("Error in getOfficialChannels:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export const getAllChannels = async (req: Request, res: Response) => {
    try {
        const channels = await ChannelModel.getAllChannels();
        return res.json({
            channels: channels || [],
            count: (channels?.length || 0)
        });
    } catch (error) {
        console.error("Error in getAllChannels:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getNearbyChannels = async (req: Request, res: Response) => {
    try {
        const latitude = req.query.lat;
        const longitude = req.query.lng;

        if (!latitude || !longitude || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
            return res.status(400).json({ error: 'Invalid latitude and longitude' });
        }

        const channels = await ChannelModel.getNearbyChannels(parseFloat(latitude as string), parseFloat(longitude as string));

        return res.json({
            channels: channels || [],
            count: (channels?.length || 0)
        });
    } catch (error) {
        console.error("Error in getNearbyChannels:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getChannelById = async (req: Request, res: Response) => {
    try {
        // Line below was researched through Google Gemini
        const id = req.params.id as string; // Using params since we want id to be within url address ex: /:id
        const channel = await ChannelModel.getChannelById(id);

        if (!channel) {
            return res.status(404).json({ error: 'Channel not found' });
        }

        return res.json({
            channelByID: channel
        });

    } catch (error) {
        console.error("Error in getChannelId:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Some parts of this function were researched through Google Gemini, such as how to access the authenticated user from the AuthenticatedRequest
export const createChannel = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const name = req.body.name;
        const lat = req.body.lat;
        const lng = req.body.lng;
        const radiusMeters = req.body.radiusMeters;
        const createdBy = req.AuthUser?.id;
        const userRole = req.AuthUser?.role;
        // Admins create official channels, members create community channels
        const type = userRole === 'admin' ? 'official' : 'community';

        if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
            return res.status(400).json({ error: 'Invalid latitude and longitude' });
        }

        if (!createdBy) {
            return res.status(401).json({ error: 'Authentication error' });
        }

        const newChannel = await ChannelModel.createChannel(name, lat, lng, radiusMeters, createdBy, type);
        return res.status(201).json({ 
            channel: newChannel 
        });

    } catch (error) {
        console.error("Error in createChannel:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteChannel = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const id = req.params.id as string;
        const userId = req.AuthUser?.id;
        const userRole = req.AuthUser?.role;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication error' });
        }
        let deletedChannel = false;

        if (userRole === 'admin') {
            // Admin can delete any channel, so we call a different function that does not check for the creator of the channel
            deletedChannel = await ChannelModel.adminDeleteChannel(id);
        }
        else if (userRole === 'member') {
            deletedChannel = await ChannelModel.deleteChannel(id, userId);
        }

        if (!deletedChannel) {
            return res.status(403).json({ error: 'Channel not found or user not authorized to delete' });
        }

        return res.status(200).json({ message: 'Channel deleted successfully', deletedChannelId: id });
    } catch (error) {
        console.error("Error in deleteChannel:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
