import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import env from "dotenv";
import connection from './connection.js';
import router from './router.js';
import cors from "cors";

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// API routes should come first - process JSON data
app.use(express.json({ limit: "100mb" }));
app.use("/api", router);

// Serve static files from the frontend's "dist" folder
app.use(express.static(path.join(__dirname, '../clientside/dist')));

// AFTER API routes, handle all other routes and serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../clientside/dist/index.html'));
});

connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server started at http://localhost:${process.env.PORT}`);
    });
});