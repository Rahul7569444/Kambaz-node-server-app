import mongoose from "mongoose";
const quizzesSchema = new mongoose.Schema({
    _id: { type: String, index: false},
    title: { type: String, required: true},
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
    due: String,
    availableFrom: String,
    availableUntil: String,
    questions: Array,
    points: Number,
    quizType: {
        type: String, 
        enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
        default: "Graded Quiz" 
    },
    assignmentGroup: {
        type: String, 
        enum: ["Assignments", "Quizzes", "Exams", "Project"],
        default: "Quizzes" 
    },
    instructions: String,
    shuffleAnswers: {
        type: Boolean, 
        default: true 
    },
    timeLimit: {
        type: Boolean, 
        default: true
    },
    minutes: {type: String, default: "20"},
    allowMultipleAttempts: {
        type: Boolean, 
        default: false
    },
    assignTo: String,
    status: String,
    showCorrectAnswers: {
        type: Boolean,
        default: true
    },
    accessCode: String,
    oneQuestionAtATime: {
        type: Boolean, 
        default: true
    },
    webcamRequired: {
        type: Boolean,
        default: false
    },
    lockQuestions: {
        type: Boolean,
        default: false
    },
    requiredToViewResults: {
        type: Boolean, 
        default: false
    },
    requireLockdownBrowser: {
        type: Boolean,
        default: false
    },
    viewResponses: {
        type: Boolean,
        default: true
    },
    attemptsAllowed: {
        type: Number,
        default: 1
    }
  },
  { collection: "quizzes" }
);
export default quizzesSchema;
