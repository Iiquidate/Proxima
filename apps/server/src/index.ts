import 'dotenv/config';

import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerSocketHandlers } from './sockets/handler';
import cors from 'cors';

import authRouter from './routes/auth';
import channelRouter from './routes/channels';
import messageRouter from './routes/message';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/channels', channelRouter);
app.use('/messages', messageRouter);

const PORT = process.env.PORT || 3000;

registerSocketHandlers(io);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
