import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  seedType: {
    type: Number,
    required: true
  },
  outputCount: {
    type: Number,
    required: true
  },
  // --- NEW FIELDS ---
  potsDoneCount: {
    type: Number,
    required: true,
    default: 0 // Starts at 0 when a batch is created
  },
  status: {
    type: String,
    required: true,
    enum: ['progressing', 'paused', 'finished'], // The only possible states
    default: 'progressing' // New batches start as 'progressing'
  },
  soilLevel: {
    type: Number, // Assuming this is a percentage (0-100)
    required: true,
    default: 100
  },
  cupLevel: {
    type: Number, // Assuming this is a percentage (0-100)
    required: true,
    default: 100
  }
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
