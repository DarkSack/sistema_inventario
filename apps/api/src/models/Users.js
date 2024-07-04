import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      minlength: [3, "User Name must be at least 3 characters long"],
      maxlength: [50, "User Name cannot exceed 50 characters"],
    },
    userEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    userPassword: {
      type: String,
      required: [true, "User Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    userPhone: {
      type: String,
      trim: true,
    },
    userAddress: {
      type: String,
      trim: true,
    },
    userFullname: {
      type: String,
      trim: true,
    },
    userGender: {
      type: String,
      trim: true,
    },
    userAge: {
      type: Number,
      min: [0, "Age must be positive"],
      max: [120, "Age cannot exceed 120"],
    },
    userPhoto: {
      type: String,
      trim: true,
    },
    userPermissions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Manejo de errores de validación
userSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(new Error(`Validation Error: ${error.message}`));
  } else {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
