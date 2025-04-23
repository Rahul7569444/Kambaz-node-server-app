import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    app.put("/api/assignments/:assignmentId", async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const assignmentUpdates = req.body;
            const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
            res.send(status);
        } catch (error) {
            console.error("Error updating assignment:", error);
            res.status(500).json({ message: "Error updating assignment" });
        }
    });

    app.get("/api/courses/:courseId/assignments", async (req, res) => {
        try {
            const { courseId } = req.params;
            const assignments = await dao.getAssignmentsForCourse(courseId);
            res.send(assignments);
        } catch (error) {
            console.error("Error getting assignments:", error);
            res.status(500).json({ message: "Error getting assignments" });
        }
    });

    app.delete("/api/assignments/:assignmentId", async (req, res) => {
        try {
            const { assignmentId } = req.params;
            const status = await dao.removeAssignment(assignmentId);
            res.send(status);
        } catch (error) {
            console.error("Error removing assignment:", error);
            res.status(500).json({ message: "Error removing assignment" });
        }
    });

    app.post("/api/assignments/create", async (req, res) => {
        try {
            const assignment = req.body;
            const newAssignment = await dao.createAssignment(assignment);
            res.json(newAssignment);
        } catch (error) {
            console.error("Error creating assignment:", error);
            res.status(500).json({ message: "Error creating assignment" });
        }
    });

    app.get("/api/assignments", async (req, res) => {
        try {
            const assignments = await dao.getAllAssignments();
            res.send(assignments);
        } catch (error) {
            console.error("Error getting assignments:", error);
            res.status(500).json({ message: "Error getting assignments" });
        }
    });
}