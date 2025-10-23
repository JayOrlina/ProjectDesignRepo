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
  potsDoneCount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Ongoing', 'Paused', 'Finished'], // The only possible states
    default: 'Ongoing' // New batches start as 'Ongoing'
  },
  soilLevel: {
    type: Number,
    enum: [0,1],
    default: 1
  },
  cupLevel: {
    type: Number, 
    enum: [0,1],
    default: 1
  }
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);

export default Batch;
