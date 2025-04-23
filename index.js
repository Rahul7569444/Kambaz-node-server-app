console.log("Script starting...");
import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import session from "express-session";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentRoutes from './Kambaz/Enrollments/routes.js';
import AssignmentRoutes from './Kambaz/Assignments/routes.js';
import QuizRoutes from "./Kambaz/Quizzes/routes.js";

// Make the database name more explicit
const DB_NAME = "kambaz";
const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || `mongodb://127.0.0.1:27017/kambaz`;

console.log("Attempting to connect to MongoDB...");
console.log("Connection string:", CONNECTION_STRING);
console.log("Environment variables:", {
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  NODE_ENV: process.env.NODE_ENV
});

// Create a simple schema for testing
const TestSchema = new mongoose.Schema({
  name: String,
  timestamp: { type: Date, default: Date.now }
});

// Create a model
const Test = mongoose.model('Test', TestSchema);

// Set up connection options to ensure we use the correct database
const connectionOptions = {
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(CONNECTION_STRING, connectionOptions)
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    console.log("MongoDB connection state:", mongoose.connection.readyState);
    console.log("MongoDB host:", mongoose.connection.host);
    console.log("MongoDB database:", mongoose.connection.name);
    
    // Try to create a document
    try {
      const testDoc = new Test({ name: "Connection Test" });
      await testDoc.save();
      console.log("Successfully created a test document");
      
      // Try to find the document
      const foundDoc = await Test.findOne({ name: "Connection Test" });
      console.log("Successfully retrieved the test document:", foundDoc);
      
      // Clean up - delete the test document
      await Test.deleteOne({ name: "Connection Test" });
      console.log("Successfully deleted the test document");
      
      console.log("MongoDB connection test completed successfully!");
    } catch (error) {
      console.error("Error during database operations:", error);
    }
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if connection fails
  });

const app = express();
console.log("Setting up middleware...");

app.use(cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:3000",
}));

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};

if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}

app.use(session(sessionOptions));
app.use(express.json());

console.log("Setting up routes...");
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
AssignmentRoutes(app);
QuizRoutes(app);
Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});

console.log("Server setup complete, waiting for connections...");