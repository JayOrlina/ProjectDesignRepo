import express from "express";
import { getAllBatch, getBatchById, createBatch, updateBatch, deleteBatch, cancelBatch } from "../controllers/batchController.js";

const router = express.Router();

router.get("/", getAllBatch);
router.get("/:id", getBatchById);
router.post("/", createBatch);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);
router.put('/:id/cancel', cancelBatch);

export default router;



