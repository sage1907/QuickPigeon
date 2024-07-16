import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password before saving the user
UserSchema.pre('save', async function (next) {
  // If PII is modified or new user
  if (this.isModified('password') || this.isNew) {

      try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
      } catch (error) {
          return next(error);
      }
  }
});

//compile the schema to model
const User = mongoose.model("User", UserSchema);

export default User;