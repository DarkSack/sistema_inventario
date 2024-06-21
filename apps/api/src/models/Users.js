import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    validate: {
      validator: function (v) {
        // Validación personalizada
        return /^[a-zA-Z0-9_-]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid User ID!`,
    },
  },
  userName: {
    type: String,
    minlength: [3, "User Name must be at least 3 characters long"],
    maxlength: [50, "User Name cannot exceed 50 characters"],
  },
  userEmail: {
    type: String,
    required: [true, "Email is required"],
  },
  userPassword: {
    type: String,
    required: [true, "User Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  userPhone: {
    type: String,
  },
  userAddress: { type: String },
  userFullname: { type: String },
  userGender: { type: String },
  userAge: {
    type: Number,
    min: [0, "Age must be positive"],
    max: [120, "Age cannot exceed 120"],
  },
  userPhoto: { type: String },
  userPermissions: { type: Array },
});

// Manejo de errores de validación
userSchema.post("save", function (error, next) {
  if (error.name === "ValidationError") {
    next(new Error(`${error.message}`));
  } else {
    next(error);
  }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
