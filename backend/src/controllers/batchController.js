import Batch from '../models/Batch.js';

// --- Define the low supply threshold ---
// If soil or cup level drops below this percentage, the process will pause.
const LOW_SUPPLY_THRESHOLD = 20; // e.g., 20%

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
        // The new fields (potsDoneCount, status, etc.) will use their default values from the model
        const batch = new Batch({ title, content, seedType, outputCount });
        const savedBatch = await batch.save();
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
        if (batch.status === 'finished') {
            return res.status(400).json({ message: "This batch is already finished." });
        }

        // --- CORE LOGIC ---

        // 1. Update values based on sensor data from the request body.
        if (soilLevel !== undefined) batch.soilLevel = soilLevel;
        if (cupLevel !== undefined) batch.cupLevel = cupLevel;
        if (potsIncrement) batch.potsDoneCount += Number(potsIncrement);

        // 2. Check for low supplies and pause if necessary.
        if (batch.soilLevel < LOW_SUPPLY_THRESHOLD || batch.cupLevel < LOW_SUPPLY_THRESHOLD) {
            batch.status = 'paused';
        } else {
            // 3. If supplies are sufficient, check if the batch is complete.
            if (batch.potsDoneCount >= batch.outputCount) {
                batch.status = 'finished';
                batch.potsDoneCount = batch.outputCount; // Cap the count at the target
            } else {
                // 4. If supplies are good and it's not finished, it must be progressing.
                batch.status = 'progressing';
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
