import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const clientDist = path.join(projectRoot, 'client', 'dist');
app.disable('x-powered-by');
if (process.env.NODE_ENV !== 'production') {
  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(value => value.trim());
  app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)) }));
}
app.use(express.json({ limit: '32kb' }));
app.get('/health', (_req,res)=>res.json({success:true,status:'ok'}));
app.use('/api/v1', api);
app.use('/api', notFound);
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist, { index: false }));
  app.get('*', (_req, res, next) => {
    res.sendFile(path.join(clientDist, 'index.html'), error => { if (error) next(error); });
  });
}
app.use(notFound);
app.use(errorHandler);
export default app;
