import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("QuizzesModel", schema);
export default model;