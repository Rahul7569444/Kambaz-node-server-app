import * as dao from "./dao.js";

function EnrollmentRoutes(app) {
    const findAllEnrollments = async (req, res) => {
        const enrollments = await dao.findAllEnrollments();
        res.json(enrollments);
    };

    const createEnrollment = async (req, res) => {
        const enrollment = await dao.createEnrollment(req.body);
        res.json(enrollment);
    };

    const deleteEnrollment = async (req, res) => {
        const status = await dao.deleteEnrollment(req.params.eid);
        res.json(status);
    };

    const findEnrollmentsByUser = async (req, res) => {
        const enrollments = await dao.findEnrollmentsByUser(req.params.uid);
        res.json(enrollments);
    };

    const findEnrollmentsByCourse = async (req, res) => {
        const enrollments = await dao.findEnrollmentsByCourse(req.params.cid);
        res.json(enrollments);
    };

    app.get("/api/enrollments", findAllEnrollments);
    app.post("/api/enrollments", createEnrollment);
    app.delete("/api/enrollments/:eid", deleteEnrollment);
    app.get("/api/users/:uid/enrollments", findEnrollmentsByUser);
    app.get("/api/courses/:cid/enrollments", findEnrollmentsByCourse);
}

export default EnrollmentRoutes; 