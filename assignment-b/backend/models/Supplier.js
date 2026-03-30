const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Index on name for faster lookups
supplierSchema.index({ name: 1 });

module.exports = mongoose.model("Supplier", supplierSchema);
