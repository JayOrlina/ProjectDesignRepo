import Batch from '../models/Batch.js';

export async function getAllBatch(_, res) {
    try {
        const batch = await Batch.find().sort({ createdAt: -1 }); //newest first (-1)
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
        const {title, content, seedType, outputCount} = req.body
        const batch = new Batch({ title, content, seedType, outputCount });

        const savedBatch = await batch.save();
        res.status(201).json(savedBatch);
    } catch (error) {
        console.error("Error in createBatch controller", error);
        res.status(500).json({ message: "Error creating batch" });
    }
}

export async function updateBatch(req, res) {
    try {
        const {title, content} = req.body;
        const updatedBatch = await Batch.findByIdAndUpdate(
            req.params.id, 
            {title, content}, 
            { new: true }
        );

        if (!updatedBatch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        
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
