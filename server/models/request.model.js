import mongoose from "mongoose";
const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// compile the schema to the model
const Request = mongoose.model("Request", RequestSchema);

export default Request;