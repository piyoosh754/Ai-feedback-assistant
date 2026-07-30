import express from "express";
import upload from "../config/multer.js";
import { uploadFeedbackCSV, getAllFeedback, generateSynthesis, getFeedbackStats, getFeedbackTrend, searchFeedback, deleteFeedback} from "../controllers/feedbackControllers.js";

const router = express.Router();
router.post("/upload", upload.single("file"), uploadFeedbackCSV);
router.get("/", getAllFeedback)
router.post("/synthesis", generateSynthesis)
router.get('/stats', getFeedbackStats)
router.get("/trend", getFeedbackTrend);
router.get("/search", searchFeedback);
router.delete("/:id", deleteFeedback);
export default router;
