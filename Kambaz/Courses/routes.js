import * as dao from "./dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
import * as moduleDao from "./modules.dao.js";
import * as assignmentDao from "./assignments.dao.js";

export default function CourseRoutes(app) {
    const findAllCourses = async (req, res) => {
        const courses = await dao.findAllCourses();
        res.json(courses);
    };

    const findCourseById = async (req, res) => {
        const course = await dao.findCourseById(req.params.id);
        res.json(course);
    };

    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.status(401).json({ message: "Please sign in first" });
            return;
        }
        const course = await dao.createCourse({ ...req.body, instructor: currentUser._id });
        // Automatically enroll the creator as instructor
        await enrollmentsDao.createEnrollment({
            user: currentUser._id,
            course: course._id
        });
        res.json(course);
    };

    const updateCourse = async (req, res) => {
        const { id } = req.params;
        const status = await dao.updateCourse(id, req.body);
        const course = await dao.findCourseById(id);
        res.json(course);
    };

    const deleteCourse = async (req, res) => {
        const status = await dao.deleteCourse(req.params.id);
        res.json(status);
    };

    // Module routes
    const findModulesForCourse = async (req, res) => {
        const modules = await moduleDao.findModulesForCourse(req.params.cid);
        res.json(modules);
    };

    const createModule = async (req, res) => {
        const { cid } = req.params;
        const newModule = await moduleDao.createModule({ ...req.body, course: cid });
        res.json(newModule);
    };

    const updateModule = async (req, res) => {
        const { mid } = req.params;
        const status = await moduleDao.updateModule(mid, req.body);
        res.json(status);
    };

    const deleteModule = async (req, res) => {
        const { mid } = req.params;
        const status = await moduleDao.deleteModule(mid);
        res.json(status);
    };

    // Assignment routes
    const findAssignmentsForCourse = async (req, res) => {
        const assignments = await assignmentDao.findAssignmentsForCourse(req.params.cid);
        res.json(assignments);
    };

    const createAssignment = async (req, res) => {
        const { cid } = req.params;
        const newAssignment = await assignmentDao.createAssignment({ ...req.body, course: cid });
        res.json(newAssignment);
    };

    const updateAssignment = async (req, res) => {
        const { aid } = req.params;
        const status = await assignmentDao.updateAssignment(aid, req.body);
        res.json(status);
    };

    const deleteAssignment = async (req, res) => {
        const { aid } = req.params;
        const status = await assignmentDao.deleteAssignment(aid);
        res.json(status);
    };

    // Course routes
    app.get("/api/courses", findAllCourses);
    app.get("/api/courses/:id", findCourseById);
    app.post("/api/courses", createCourse);
    app.put("/api/courses/:id", updateCourse);
    app.delete("/api/courses/:id", deleteCourse);

    // Module routes
    app.get("/api/courses/:cid/modules", findModulesForCourse);
    app.post("/api/courses/:cid/modules", createModule);
    app.put("/api/modules/:mid", updateModule);
    app.delete("/api/modules/:mid", deleteModule);

    // Assignment routes
    app.get("/api/courses/:cid/assignments", findAssignmentsForCourse);
    app.post("/api/assignments", createAssignment);
    app.put("/api/assignments/:aid", updateAssignment);
    app.delete("/api/assignments/:aid", deleteAssignment);
}