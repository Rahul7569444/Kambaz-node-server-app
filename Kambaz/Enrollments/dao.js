import model from "./model.js";
import { v4 as uuidv4 } from "uuid"; // Add this import

export function getAllEnrollments() {
    return model.find();
}

export async function findCoursesForUser(userId) {
    try {
        console.log("Finding courses for user:", userId);
        const enrollments = await model.find({ user: userId }).populate("course");
        return enrollments.map((enrollment) => enrollment.course);
    } catch (error) {
        console.error("Error finding courses for user:", error);
        return [];
    }
}

export async function findUsersForCourse(courseId) {
    try {
        console.log("Finding users for course:", courseId);
        const enrollments = await model.find({ course: courseId }).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    } catch (error) {
        console.error("Error finding users for course:", error);
        return [];
    }
}

export function enrollUserInCourse(user, course) {
    console.log("Enrolling user:", user, "in course:", course);
    // Create a unique ID for the enrollment
    const newEnrollment = {
        _id: uuidv4(),
        user,
        course,
        enrollmentDate: new Date()
    };
    return model.create(newEnrollment);
}

export function unenrollUserFromCourse(user, course) {
    console.log("Unenrolling user:", user, "from course:", course);
    return model.deleteOne({ user, course });
}