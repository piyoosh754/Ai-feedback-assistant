import fs from "fs";
import csv from "csv-parser";
import Feedback from "../models/Feedback.js";
import { analyzeFeedback } from "../services/groqService.js";

export const generateSynthesis = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    let result = await analyzeFeedback(feedbacks);

    // Remove markdown if present
    result = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Convert string to object
    result = JSON.parse(result);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadFeedbackCSV = async (req, res) => {
  try {
    console.log("===== CONTROLLER =====");
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required",
      });
    }

    // remaining code...

    const feedbackData = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);

        feedbackData.push({
          feedbackText: row.feedbackText,
          source: row.source,
          userType: row.userType,
          productArea: row.productArea,
          date: row.date,
          rating: row.rating || null,
        });
      })

      .on("data", (row) => {
  console.log("CSV ROW:", row);

  feedbackData.push({
    feedbackText: row.feedbackText,
    source: row.source,
    userType: row.userType,
    productArea: row.productArea,
    date: row.date,
    rating: row.rating || null,
  });
})

      .on("end", async () => {
        console.log("Total Rows:", feedbackData.length);

        await Feedback.insertMany(feedbackData);

        res.status(201).json({
          success: true,
          message: "Feedback imported successfully",
          count: feedbackData.length,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "CSV processing failed",
      error: error.message,
    });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    const totalFeedback = feedbacks.length;

    const averageRating =
      feedbacks.reduce((sum, item) => sum + (Number(item.rating) || 0), 0) /
      (totalFeedback || 1);

    const areaMap = {};

    feedbacks.forEach((item) => {
      const area = item.productArea || "Other";

      areaMap[area] = (areaMap[area] || 0) + 1;
    });

    const productAreas = Object.keys(areaMap).map((key) => ({
      name: key,
      count: areaMap[key],
    }));

    res.json({
      success: true,
      totalFeedback,
      averageRating: averageRating.toFixed(1),
      productAreas,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFeedbackTrend = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    const trendMap = {};

    feedbacks.forEach((item) => {
      const date = new Date(item.date).toLocaleDateString("en-CA");

      trendMap[date] = (trendMap[date] || 0) + 1;
    });

    const trend = Object.keys(trendMap)
      .sort()
      .map((date) => ({
        date,
        count: trendMap[date],
      }));

    res.json({
      success: true,
      trend,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const searchFeedback = async (req, res) => {
  try {
    const { keyword = "", productArea = "" } = req.query;

    const filter = {};

    if (keyword) {
      filter.feedbackText = {
        $regex: keyword,
        $options: "i",
      };
    }

    if (productArea) {
      filter.productArea = productArea;
    }

    const feedbacks = await Feedback.find(filter);

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};