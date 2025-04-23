import * as dao from "./dao.js";

export default function QuizRoutes(app) {
  const findAllCourseQuizzes = async (req, res) => {
    const quizzes = await dao.findAllCourseQuizzes(req.params.cid);
    res.json(quizzes);
  };
  app.get("/api/courses/:cid/quizzes", findAllCourseQuizzes);

  const createQuiz = async (req, res) => {
    const newQuiz = {
      ...req.body,
      course: req.params.cid,
      _id: new Date().getTime().toString(),
    };
    const quiz = await dao.createQuiz(newQuiz);
    res.json(quiz);
  };
  app.post("/api/courses/:cid/quizzes", createQuiz);

  const deleteQuiz = async (req, res) => {
    const status = await dao.deleteQuiz(req.params.qid);
    res.json(status);
  };
  app.delete("/api/quizzes/:qid", deleteQuiz);

  const updateQuiz = async (req, res) => {
    const status = await dao.updateQuiz(req.params.qid, req.body);
    res.json(status);
  };
  app.put("/api/quizzes/:qid", updateQuiz);

  const findQuiz = async (req, res) => {
    const quiz = await dao.findOneQuiz(req.params.cid, req.params.qid);
    res.json(quiz);
  };
  app.get("/api/courses/:cid/quizzes/:qid", findQuiz);
}
