import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
    {
        _id: String,
        title: String,
        course: { type: String, ref: "CourseModel" },
        unlock: Date,
        due: Date,
        description: String,
        points: Number,
    },
    {collection: "assignments"}
);
export default assignmentSchema;