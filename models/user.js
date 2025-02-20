import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      maxLength: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email) => {
          const emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
          return emailRegEx.test(email);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // validate: {
      //   validator: (password) => {
      //     const pwRegEx =
      //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,24}$/;
      //     return pwRegEx.test(password);
      //   },
      //   message:
      //     "Password must be 6-24 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character ($@$!%*?&_).",
      // },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordTokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
