import model from "./model.js";
import { v4 as uuidv4 } from "uuid"; // Add this import

export function updateModule(moduleId, moduleUpdates) {
    return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}

export function deleteModule(moduleId) {
    return model.deleteOne({ _id: moduleId });
}

export function createModule(module) {
    // Generate a string ID
    const newModule = {
        ...module,
        _id: uuidv4()
    };
    return model.create(newModule);
}

export function findModulesForCourse(courseId) {
    return model.find({ course: courseId });
}