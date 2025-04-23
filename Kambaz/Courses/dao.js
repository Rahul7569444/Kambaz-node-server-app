import model from "./model.js";
import { v4 as uuidv4 } from "uuid"; // Add this import

// No longer need Database import
// import Database from "../Database/index.js";

export function findAllCourses() {
    return model.find();
}

// This function should be replaced with a MongoDB query instead of using the Database import
export async function findCoursesForEnrolledUser(userId) {
    try {
        console.log("Finding courses for enrolled user:", userId);
        
        // This should be handled through the enrollments collection
        // This function should be moved to the enrollments DAO
        
        return []; // Return empty array for now - this function should be removed/relocated
    } catch (error) {
        console.error("Error finding courses for enrolled user:", error);
        return [];
    }
}

export function createCourse(course) {
    // Generate a string ID for the course
    const newCourse = {
        ...course,
        _id: uuidv4()
    };
    console.log("Creating new course:", newCourse.name);
    return model.create(newCourse);
}

export function deleteCourse(courseId) {
    console.log("Deleting course:", courseId);
    return model.deleteOne({ _id: courseId });
}

export function updateCourse(courseId, courseUpdates) {
    console.log("Updating course:", courseId);
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}