import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: String,  // Add this line to explicitly use String IDs
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    email: String,
    lastName: String,
    dob: Date,
    role: {
        type: String,
        enum: ["STUDENT", "FACULTY", "ADMIN", "USER"],
        default: "USER",
    },
    loginId: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
    quizAttempts: Array,
},
    { collection: "users" }
);
export default userSchema;