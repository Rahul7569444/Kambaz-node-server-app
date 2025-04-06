import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses() {
    return Database.courses;
}

export function findCourseById(courseId) {
    return Database.courses.find(course => course._id === courseId);
}

export function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = Database;
    const enrolledCourses = courses.filter((course) =>
        enrollments.some((enrollment) => 
            enrollment.user === userId && 
            enrollment.course === course._id
        )
    );
    return enrolledCourses;
}

export function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    Database.courses = [...Database.courses, newCourse];
    return newCourse;
}

export function updateCourse(courseId, course) {
    Database.courses = Database.courses.map(c => 
        c._id === courseId ? { ...course, _id: courseId } : c
    );
    return { status: "OK" };
}

export function deleteCourse(courseId) {
    Database.courses = Database.courses.filter(c => c._id !== courseId);
    // Also clean up enrollments
    Database.enrollments = Database.enrollments.filter(e => e.course !== courseId);
    return { status: "OK" };
}
