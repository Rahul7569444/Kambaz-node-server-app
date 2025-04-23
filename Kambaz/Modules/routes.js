import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
    app.put("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            const status = await modulesDao.updateModule(moduleId, moduleUpdates);
            res.send(status);
        } catch (error) {
            console.error("Error updating module:", error);
            res.status(500).json({ message: "Error updating module" });
        }
    });

    app.delete("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            const status = await modulesDao.deleteModule(moduleId);
            res.send(status);
        } catch (error) {
            console.error("Error deleting module:", error);
            res.status(500).json({ message: "Error deleting module" });
        }
    });

    // Add this route for creating modules
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        try {
            const { courseId } = req.params;
            const module = {
                ...req.body,
                course: courseId
            };
            const newModule = await modulesDao.createModule(module);
            res.send(newModule);
        } catch (error) {
            console.error("Error creating module:", error);
            res.status(500).json({ message: "Error creating module" });
        }
    });
}