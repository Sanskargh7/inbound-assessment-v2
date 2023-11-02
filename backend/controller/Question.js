import mongoose from "mongoose";
import Categories from "../models/categories.js";
import ExamType from "../models/exam_type.js";
import QuestionModel from "../models/question.js";


class Question {
  static calculateQuestionInfo = async (req, res) => {
    try {
      const examName = req.body.exam_name;

      const checkExamName = await ExamType.findOne({
        $and: [{ slug: examName }, { status: "Active" }],
      });
      // console.log(checkExamName)
      if (!checkExamName) {
        return res
          .status(200)
          .json({ success: false, msg: "This Exam does not exists!" });
      }
      const fetchCategoryInfo = await ExamType.aggregate([
        { $match: { slug: examName } },
        { $unwind: "$exam_categories" },
        {
          $lookup: {
            from: "categories",
            localField: "exam_categories.category_id",
            foreignField: "_id",
            as: "data",
          },
        },
        { $unwind: "$data" },
        {
          $addFields: {
            category_name: "$data.slug",
            number_of_question: "$exam_categories.number_of_questions",
          },
        },
        {
          $project: {
            category_name: 1, number_of_question: 1, _id: "$data._id",
            exam_time: 1
          },
        },
      ]);

      // console.log(fetchCategoryInfo)
      const obj1 = {};

      fetchCategoryInfo.forEach((item, index) => {
        obj1[item._id] = item.number_of_question;
      });

      const promises = [];

      Object.entries(obj1).forEach(([key, value]) => {
        promises.push(this.getQuestionsForCategory(key, value));
      });

      const results = await Promise.all(promises);


      const resp = results.flat();
      return res.status(200).json({ success: true, data: resp, examTiming: fetchCategoryInfo[0].exam_time });
      return res.status(200).json({ data: obj2 });
    } catch (error) {
      console.log(error.message);
    }
  };

  static shuffledQuestions = async (req, res) => {
    try {
      const obj = req.body;
      const promises = [];

      Object.entries(obj).forEach(([key, value]) => {
        promises.push(getQuestionsForCategory(key, value));
      });
      const results = await Promise.all(promises);
      const resp = results.flat();
      return res.status(200).json({ data: resp });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ data: error.message });
    }
  };

  // async function getQuestionsForCategoryOld(category, limit) {
  //   const getCategoryName = await Categories.findOne({ _id: category });
  //   const questions = await QuestionModel.aggregate([
  //     { $match: { category: new mongoose.Types.ObjectId(category) } },
  //     { $addFields: { user_res: null, category_name: getCategoryName.name } },
  //     { $limit: parseInt(limit) },
  //   ]);

  //   return questions;
  // }

  static async getQuestionsForCategory(category, limit) {
    const getCategoryName = await Categories.findOne({ _id: category });
    const questions = await QuestionModel.aggregate([
      { $match: { category: new mongoose.Types.ObjectId(category) } },
      { $addFields: { user_res: null, category_name: getCategoryName.name } },
      { $limit: parseInt(limit) },
    ]);
    // const questions = await QuestionModel.aggregate([
    //   { $match: { category: category } },
    //   { $addFields: { user_res: null } },
    // ]);
    return this.shuffleAndReduce(questions, parseInt(limit));
  }

  static shuffleAndReduce(array, newSize) {
    const shuffledArray = [...array];
    while (shuffledArray.length > newSize) {
      const randomIndex = Math.floor(Math.random() * shuffledArray.length);
      shuffledArray.splice(randomIndex, 1);
    }
    return shuffledArray;
  }

  //
  static questionListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const quesons = await QuestionModel.find({}, { option: 0 });
      const questions = await QuestionModel.find({}, { option: 0 })

        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        questions,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };
}

export default Question;