import express from 'express';
import cors from 'cors';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));
app.get('/health', (_req,res)=>res.json({success:true,status:'ok'}));
app.use('/api/v1', api);
app.use(notFound);
app.use(errorHandler);
export default app;
