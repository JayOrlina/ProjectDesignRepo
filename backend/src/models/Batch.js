import mongoose from 'mongoose';

// 1 create a schema
const batchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, 
{ timestamps: true } //createdAt and updatedAt fields
);

// 2 create a model based on schema

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;