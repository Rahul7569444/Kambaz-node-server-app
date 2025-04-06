import "dotenv/config";
import express from 'express';
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import session from "express-session";
const app = express();

// Configure CORS first
app.use(
    cors({
        credentials: true,
        origin: [
            process.env.NETLIFY_URL || "http://localhost:5173",
            "https://a5--kambaz-react-web-app-yw.netlify.app",
            "https://a5-kambaz-react-web-app-yw.netlify.app"
        ],
    })
);

// Configure session
const sessionOptions = {
    secret: "kambaz",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production"
    }
};

app.set('trust proxy', 1); // trust first proxy
app.use(session(sessionOptions));
app.use(express.json());

// Add root route handler
app.get("/", (req, res) => {
    res.send("Welcome to the Kambaz API Server");
});

UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
Lab5(app);
app.listen(process.env.PORT || 4000);
