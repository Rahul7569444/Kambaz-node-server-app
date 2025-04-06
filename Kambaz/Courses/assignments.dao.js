import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const findAllAssignments = () => {
    return Database.assignments;
};

export const findAssignmentById = (assignmentId) => {
    return Database.assignments.find(
        (assignment) => assignment._id === assignmentId
    );
};

export const findAssignmentsForCourse = (courseId) => {
    return Database.assignments.filter(
        (assignment) => assignment.course === courseId
    );
};

export const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    Database.assignments = [...Database.assignments, newAssignment];
    return newAssignment;
};

export const updateAssignment = (assignmentId, assignment) => {
    Database.assignments = Database.assignments.map((a) =>
        a._id === assignmentId ? { ...assignment, _id: assignmentId } : a
    );
    return { status: "OK" };
};

export const deleteAssignment = (assignmentId) => {
    Database.assignments = Database.assignments.filter(
        (assignment) => assignment._id !== assignmentId
    );
    return { status: "OK" };
}; 