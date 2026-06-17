import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email : {
      type: String,
      required: true,
      unique: true
    },

    role: {
        type: String,
        required: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    publicKey: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
