import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
    user: {
        ref: "users",
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    company: {
        ref: "companies",
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

const Subscription = mongoose.model("subscriptions", SubscriptionSchema);

export default Subscription;
