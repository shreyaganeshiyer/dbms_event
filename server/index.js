import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import queryRoutes from './routes/queries.js';
import connectionRoutes from './routes/connections.js';

// app's database
import { ensureSchema } from './utility/appDb.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin: ['http://localhost:5173'] }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/connections', connectionRoutes);
app.use('/api/queries', queryRoutes);

app.listen(PORT, async () => {
  console.log(`QueryLens API running on http://localhost:${PORT}`);
  try {
    await ensureSchema();
    console.log('App database ready.');
  } catch (err) {
    console.error(`Could not set up the app database: ${err.message}`);
  }
});