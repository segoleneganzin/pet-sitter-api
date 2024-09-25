import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { dbConnection } from './database/connection';
import sittersRoutes from './routes/sitterRoutes';
import userRoutes from './routes/userRoutes';
import ownerRoutes from './routes/ownerRoutes';
import authRoutes from './routes/authRoutes';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

dotenv.config();

const swaggerDocs = yaml.load('./swagger.yaml');
const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/v1/uploads', express.static(staticFilesDirectory));

// Request payload middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle custom routes
app.use('/api/v1/users/sitters', sittersRoutes);
app.use('/api/v1/users/owners', ownerRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);

// API Documentation
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from my Express server API!');
});
