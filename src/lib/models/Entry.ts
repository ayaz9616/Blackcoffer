import { Schema, models, model } from 'mongoose';

const EntrySchema = new Schema({
  end_year: String,
  intensity: Number,
  sector: String,
  topic: String,
  insight: String,
  url: String,
  region: String,
  start_year: String,
  impact: String,
  added: String,
  published: String,
  country: String,
  relevance: Number,
  pestle: String,
  source: String,
  title: String,
  likelihood: Number,
  city: String,
  swot: String,
});

export default models.Entry || model('Entry', EntrySchema); 