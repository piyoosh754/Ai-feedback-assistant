import express from "express"
 import {
    registerUser, loginUser
 } from "../controllers/authControllers.js"

import authMiddleware from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/register", registerUser);

router.post("/login",loginUser )

router.post("/profile", authMiddleware, (req, res, next)=>{
    return res.status(200).json({
        success:"true",
        user: req.user
    })
})

export default router;