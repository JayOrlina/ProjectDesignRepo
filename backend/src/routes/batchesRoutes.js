import express from "express";
import { getAllBatch, getBatchById, createBatch, updateBatch, deleteBatch } from "../controllers/batchController.js";

const router = express.Router();

router.get("/", getAllBatch);
router.get("/:id", getBatchById);
router.post("/", createBatch);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

export default router;



