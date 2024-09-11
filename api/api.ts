import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { dbConnection } from './database/connection';
import sittersRoutes from './routes/sitterRoutes';
import userRoutes from './routes/userRoutes';
import ownerRoutes from './routes/ownerRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// dbConnection().catch((err: unknown) => {
//   console.error('Failed to connect to the database', err);
//   process.exit(1);
// });

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const staticFilesDirectory = path.join(__dirname, '../public/uploads');
app.use('/api/uploads', express.static(staticFilesDirectory));

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle custom routes
app.use('/api/sitters', sittersRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from my Express server API!');
});
