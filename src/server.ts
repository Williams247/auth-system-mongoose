import express, { Application, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Status, UserPayload } from "./utils/types/default";
import appRouter from "./routes"

dotenv.config();
declare global {
		namespace Express {
				interface Request {
						user: UserPayload;
				}
		}
}

const app: Application = express();

app.use(bodyParser.urlencoded({
		extended: true, limit: '50mb'
}));

app.use(bodyParser.json({ limit: '50mb' }));

app.use(morgan('dev'));

app.use(function (request: Request, response: Response, next: NextFunction) {
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
		response.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
		next();
});

app.use("/v1", appRouter);

app.use((request: Request, response: Response) => {
		response.status(Status.NOT_FOUND).json({ message: 'Route not found' });
});

const port = process.env.PORT || process.env.LOCALHOST;
const env = process.env.ENV;

app.listen(port, async function (): Promise<void> {
		try {
				await mongoose.connect(process.env.DATABASE_URI as string);
				console.log(env === 'development' ? 'App started, connect to:\nhttp://localhost:8000' : 'Connection established');
		} catch (error) {
				console.log(error);
		}
});
