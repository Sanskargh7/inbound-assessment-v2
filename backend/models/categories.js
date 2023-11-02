import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchemeType = new Schema({
  name: {
    type: String,

    required: true,
  },

  status: {
    type: String,

    required: true,
  },

  date: {
    type: Date,

    default: Date.now,
  },
});

export default mongoose.model("categories", CategorySchemeType);
