import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    text: {
        type: String,
    },
    seen: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String
    },
    fileType: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model(
    "Message",
    messageSchema
);