import { Server } from 'socket.io';                                                                                                                                                   
import { createMessage } from '../models/messageModel';
                                                                                                                                                                                    
export function registerSocketHandlers(io: Server) {
    io.on('connection', (socket) => {                                                                                                                                                 
        console.log('Client connected:', socket.id);                                                                                                                                  

        socket.on('joinChannel', (channelId: string) => {                                                                                                                             
            socket.join(channelId);                                                                                                                                                 
            console.log(`${socket.id} joined channel ${channelId}`);
        });                             

        socket.on('leaveChannel', (channelId: string) => {                                                                                                                            
            socket.leave(channelId);
            console.log(`${socket.id} left channel ${channelId}`);                                                                                                                    
        });                                                                                                                                                                         
                                        
        socket.on('sendMessage', async (data: { channelId: string; userId: string; content: string }) => {
            try {                                                                                                                                                                     
                const message = await createMessage(data.channelId, data.userId, data.content);
                io.to(data.channelId).emit('newMessage', message);                                                                                                                    
            } catch (err) {                                                                                                                                                         
                console.error('Failed to send message:', err);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}