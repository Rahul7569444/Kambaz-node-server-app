import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export const findModulesForCourse = async (courseId) => {
    return Database.modules.filter(module => module.course === courseId);
};

export const createModule = async (module) => {
    const newModule = { ...module, _id: uuidv4() };
    Database.modules = [...Database.modules, newModule];
    return newModule;
};

export const updateModule = async (moduleId, module) => {
    Database.modules = Database.modules.map(m => 
        m._id === moduleId ? { ...module, _id: moduleId } : m
    );
    return { status: "OK" };
};

export const deleteModule = async (moduleId) => {
    Database.modules = Database.modules.filter(m => m._id !== moduleId);
    return { status: "OK" };
}; 