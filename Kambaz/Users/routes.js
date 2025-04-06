import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };

    const findAllUsers = async (req, res) => {
        const users = await dao.findAllUsers();
        res.json(users);
    };

    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        const status = await dao.updateUser(userId, userUpdates);
        const currentUser = await dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    //app.post("/api/users/signup", signup);

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);
            if (currentUser) {
                req.session["currentUser"] = currentUser;
                res.json(currentUser);
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error signing in" });
        }
    };
    //app.post("/api/users/signin", signin);

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    //app.post("/api/users/signout", signout);

    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const findCoursesForUser = async (req, res) => {
        const currentUser = req.session.currentUser;
        if (!currentUser) {
            res.status(401).json({ message: "User not logged in" });
            return;
        }

        const user = await dao.findUserById(currentUser._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        let courses;
        if (user.role === "FACULTY") {
            courses = await courseDao.findAllCourses();
        } else {
            courses = await courseDao.findCoursesForEnrolledUser(user._id);
        }
        res.json(courses);
    };

    const createCourse = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.status(401).json({ message: "Not logged in" });
                return;
            }

            const newCourse = await Promise.resolve(courseDao.createCourse(req.body));
            const enrollment = await enrollmentsDao.createEnrollment({
                user: currentUser._id,
                course: newCourse._id
            });
            
            res.json(newCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error creating course" });
        }
    };
    app.post("/api/users/current/courses", createCourse);

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.get("/api/users/current/courses", findCoursesForUser);
    //app.put("/api/users/:userId", updateUser);
}


