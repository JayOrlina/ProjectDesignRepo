import Batch from '../models/Batch.js';
import axios from 'axios';

const HARDWARE_IP = "http://192.168.1.50";

export async function getAllBatch(_, res) {
    try {
        const batch = await Batch.find().sort({ createdAt: -1 });
        res.status(200).json(batch);
    } catch (error) {
        console.error("Error in getAllBatch controller",error);
        res.status(500).json({ message: "Error fetching batch" });
    }
}

export async function getBatchById(req, res) {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json(batch);
    } catch (error) {
        console.error("Error in getBatchById controller", error);
        res.status(500).json({ message: "Error fetching batch" });
    }
}

export async function createBatch(req, res) {
    try {
        const {title, content, seedType, outputCount} = req.body;
        
        const batch = new Batch({ title, content, seedType, outputCount });
        const savedBatch = await batch.save();

        // --- 3. ADD THIS BLOCK ---
        try {
            // Tell the hardware to start this new batch
            await axios.post(`${HARDWARE_IP}/start-batch`, {
                batchId: savedBatch._id
            });
            console.log(`Successfully sent start command to hardware for batch: ${savedBatch._id}`);
            
        } catch (hwError) {
            console.error("CRITICAL: Failed to contact hardware.", hwError.message);
            // This is a non-fatal error, the batch is still created.
        }
        // -------------------------

        res.status(201).json(savedBatch);

    } catch (error) {
        console.error("Error in createBatch controller", error);
        res.status(500).json({ message: "Error creating batch" });
    }
}

// This function now processes real-time sensor data from your hardware.
export async function updateBatch(req, res) {
    try {
        // The request body now expects sensor data.
        // `potsIncrement` should be 1 each time a pot passes the sensor.
        const { potsIncrement, soilLevel, cupLevel } = req.body;

        const batch = await Batch.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // If the batch is already finished, prevent further updates.
        if (batch.status === 'Finished') {
            return res.status(400).json({ message: "This batch is already finished." });
        }

        // --- CORE LOGIC ---

        // 1. Update values based on sensor data from the request body.
        if (soilLevel !== undefined) batch.soilLevel = soilLevel;
        if (cupLevel !== undefined) batch.cupLevel = cupLevel;
        if (potsIncrement) batch.potsDoneCount += Number(potsIncrement);

        // 2. Check for low supplies and pause if necessary.
        if (batch.soilLevel == 0 || batch.cupLevel == 0) {
            batch.status = 'Paused';
        } else {
            // 3. If supplies are sufficient, check if the batch is complete.
            if (batch.potsDoneCount >= batch.outputCount) {
                batch.status = 'Finished';
                batch.potsDoneCount = batch.outputCount; // Cap the count at the target
            } else {
                // 4. If supplies are good and it's not finished, it must be Ongoing.
                batch.status = 'Ongoing';
            }
        }
        
        const updatedBatch = await batch.save();
        res.status(200).json(updatedBatch);

    } catch (error) {
        console.error("Error in updateBatch controller", error);
        res.status(500).json({ message: "Error updating batch" });
    }
}

export async function deleteBatch(req, res) {
    try {
        const deletedBatch = await Batch.findByIdAndDelete(req.params.id);
        if (!deletedBatch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        res.status(200).json({ message: "Batch Deleted Successfully" });
    } catch (error) {
        console.error("Error in deleteBatch controller", error);
        res.status(500).json({ message: "Error deleting batch" });
    }
}
