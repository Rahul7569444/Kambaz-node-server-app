import model from "./model.js";

export const findAllCourseQuizzes = (cid) => model.find({course: cid});
export const createQuiz = (quiz) => {
    //delete quiz._id;
    return model.create(quiz);
};
export const deleteQuiz = (quizId) => model.deleteOne({_id: quizId});
export const updateQuiz = (quizId, quiz) => model.updateOne({_id: quizId}, {$set: quiz});
export const findOneQuiz = (cid, qid) => model.find({course: cid, _id: qid});