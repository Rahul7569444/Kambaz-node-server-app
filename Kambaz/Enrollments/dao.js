import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const findAllEnrollments = () => {
    return Database.enrollments;
};

export const createEnrollment = (enrollment) => {
    const newEnrollment = { ...enrollment, _id: uuidv4() };
    Database.enrollments = [...Database.enrollments, newEnrollment];
    return newEnrollment;
};

export const deleteEnrollment = (enrollmentId) => {
    Database.enrollments = Database.enrollments.filter(
        (enrollment) => enrollment._id !== enrollmentId
    );
    return { status: "OK" };
};

export const findEnrollmentsByUser = (userId) => {
    return Database.enrollments.filter(
        (enrollment) => enrollment.user === userId
    );
};

export const findEnrollmentsByCourse = (courseId) => {
    return Database.enrollments.filter(
        (enrollment) => enrollment.course === courseId
    );
};