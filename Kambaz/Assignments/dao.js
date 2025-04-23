import model from "./model.js";
import { v4 as uuidv4 } from "uuid"; // Add this import

export function getAllAssignments() {
    return model.find();
}

export function getAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
}

export function createAssignment(assignment) {
    // Generate a string ID
    const newAssignment = {
        ...assignment,
        _id: uuidv4()
    };
    return model.create(newAssignment);
}

export function removeAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
}

export function updateAssignment(assignmentId, assignmentUpdates) {
    return model.updateOne({ _id: assignmentId }, { $set: assignmentUpdates });
}