import mongoose, {Schema} from "mongoose";

const blogSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comment"
    }]
});

const blogModel = mongoose.models.blog || mongoose.model('blog', blogSchema);
export default blogModel;
