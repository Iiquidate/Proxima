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

app.get('/health', async (_req: Request, res: Response) => {
  try {
    const pool = (await import('./db/connection')).default;
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, db: true, time: result.rows[0].now });
  } catch (err: any) {
    res.json({ ok: true, db: false, error: err.message });
  }
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
