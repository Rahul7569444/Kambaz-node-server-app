import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        try {
            const user = await dao.createUser(req.body);
            res.json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ message: "Error creating user" });
        }
    };

    const deleteUser = async (req, res) => {
        try {
            const status = await dao.deleteUser(req.params.userId);
            res.json(status);
        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ message: "Error deleting user" });
        }
    };

    const findAllUsers = async (req, res) => {
        try {
            const { role, name } = req.query;
            if (role) {
                const users = await dao.findUsersByRole(role);
                res.json(users);
                return;
            }
            if (name) {
                const users = await dao.findUsersByPartialName(name);
                res.json(users);
                return;
            }
            const users = await dao.findAllUsers();
            res.json(users);
        } catch (error) {
            console.error("Error finding users:", error);
            res.status(500).json({ message: "Error finding users" });
        }
    };

    const findUserById = async (req, res) => {
        try {
            const user = await dao.findUserById(req.params.userId);
            res.json(user);
        } catch (error) {
            console.error("Error finding user:", error);
            res.status(500).json({ message: "Error finding user" });
        }
    };

    const updateUser = async (req, res) => {
        try {
            const userId = req.params.userId;
            const userUpdates = req.body;
            await dao.updateUser(userId, userUpdates);
            const currentUser = req.session["currentUser"];
            if (currentUser && currentUser._id === userId) {
                req.session["currentUser"] = { ...currentUser, ...userUpdates };
            }
            res.json(currentUser);
        } catch (error) {
            console.error("Error updating user:", error);
            res.status(500).json({ message: "Error updating user" });
        }
    };

    const signup = async (req, res) => {
        try {
            console.log("Signup attempt with:", req.body.username);
            const user = await dao.findUserByUsername(req.body.username);
            if (user) {
                console.log("Username already exists:", req.body.username);
                res.status(400).json({ message: "Username already in use" });
                return;
            }
            const currentUser = await dao.createUser(req.body);
            console.log("New user created:", currentUser.username);
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } catch (error) {
            console.error("Error during signup:", error);
            res.status(500).json({ message: "Error during signup" });
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("Signin attempt with username:", username);
            
            if (!username || !password) {
                console.log("Missing username or password");
                return res.status(400).json({ message: "Username and password are required" });
            }
            
            const currentUser = await dao.findUserByCredentials(username, password);
            console.log("User found:", !!currentUser);
            
            if (currentUser) {
                req.session["currentUser"] = currentUser;
                console.log("User authenticated successfully");
                res.json(currentUser);
            } else {
                // Log all users for debugging
                const allUsers = await dao.findAllUsers();
                console.log("Total users in database:", allUsers.length);
                if (allUsers.length > 0) {
                    console.log("Sample user:", { 
                        username: allUsers[0].username, 
                        _id: allUsers[0]._id 
                    });
                }
                
                res.status(401).json({ message: "Invalid username or password" });
            }
        } catch (error) {
            console.error("Error during signin:", error);
            res.status(500).json({ message: "Server error during signin" });
        }
    };

    const profile = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                console.log("No current user in session");
                res.sendStatus(401);
                return;
            }
            console.log("Returning profile for:", currentUser.username);
            res.json(currentUser);
        } catch (error) {
            console.error("Error getting profile:", error);
            res.status(500).json({ message: "Error getting profile" });
        }
    };

    const signout = (req, res) => {
        try {
            console.log("User signing out");
            req.session.destroy();
            res.sendStatus(200);
        } catch (error) {
            console.error("Error during signout:", error);
            res.status(500).json({ message: "Error during signout" });
        }
    };

    const findCoursesForUser = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                console.log("No current user in session");
                res.sendStatus(401);
                return;
            }
            
            if (currentUser.role === "ADMIN") {
                console.log("Admin user, returning all courses");
                const courses = await courseDao.findAllCourses();
                res.json(courses);
                return;
            }
            
            let { uid } = req.params;
            if (uid === "current") {
                uid = currentUser._id;
            }
            
            console.log("Finding courses for user:", uid);
            const courses = await enrollmentsDao.findCoursesForUser(uid);
            res.json(courses);
        } catch (error) {
            console.error("Error finding courses for user:", error);
            res.status(500).json({ message: "Error finding courses" });
        }
    };

    const createCourse = async (req, res) => {
        try {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.status(401).json({ message: "You must be logged in" });
            }
            
            console.log("Creating course for user:", currentUser._id);
            const newCourse = await courseDao.createCourse(req.body);
            await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: "Error creating course" });
        }
    };

    const enrollUserInCourse = async (req, res) => {
        try {
            let { uid, cid } = req.params;
            if (uid === "current") {
                const currentUser = req.session["currentUser"];
                if (!currentUser) {
                    return res.status(401).json({ message: "You must be logged in" });
                }
                uid = currentUser._id;
            }
            
            console.log("Enrolling user:", uid, "in course:", cid);
            const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
            res.send(status);
        } catch (error) {
            console.error("Error enrolling user:", error);
            res.status(500).json({ message: "Error enrolling user" });
        }
    };

    const unenrollUserFromCourse = async (req, res) => {
        try {
            let { uid, cid } = req.params;
            if (uid === "current") {
                const currentUser = req.session["currentUser"];
                if (!currentUser) {
                    return res.status(401).json({ message: "You must be logged in" });
                }
                uid = currentUser._id;
            }
            
            console.log("Unenrolling user:", uid, "from course:", cid);
            const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
            res.send(status);
        } catch (error) {
            console.error("Error unenrolling user:", error);
            res.status(500).json({ message: "Error unenrolling user" });
        }
    };

    // Register all routes
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
    app.get("/api/users/:uid/courses", findCoursesForUser);
    app.post("/api/users/current/courses", createCourse);
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    
    // Add a test route for debugging
    app.get("/api/users/test-auth", async (req, res) => {
        try {
            const allUsers = await dao.findAllUsers();
            console.log("Total users for testing:", allUsers.length);
            if (allUsers.length > 0) {
                const sampleUser = allUsers[0];
                console.log("Sample user:", {
                    username: sampleUser.username,
                    password: sampleUser.password,
                    _id: sampleUser._id
                });
            }
            res.json({ message: "Auth test route working" });
        } catch (error) {
            console.error("Test auth error:", error);
            res.status(500).json({ message: "Error in test auth route" });
        }
    });
}