import * as dao from "./dao.js";
export default function EnrollmentRoutes(app) {
    app.get("/api/enrollments", async (req, res) => {
        const enrollments = await dao.getAllEnrollments();
        res.send(enrollments);
    });
}