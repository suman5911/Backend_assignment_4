import express, { Express } from "express";
import healthRoutes from "./api/v1/routes/healthRoutes";

// Initialize Express application
const app: Express = express();

app.use(express.json());

app.use("/api/v1", healthRoutes);

export default app;