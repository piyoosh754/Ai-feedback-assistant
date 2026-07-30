import dotenv from "dotenv";
import app from "./app.js"
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

console.log("JWT:", process.env.JWT_SECRET);
console.log("GROQ:", process.env.GROQ_API_KEY);