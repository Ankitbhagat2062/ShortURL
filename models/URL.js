import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectURL: {
        type: String,
        required: true
    },
    userId: {  // associate exactly one user by ID
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    userType: {  // save user type here for expiration logic
        type: String,
        enum: ['Free', 'Premium'],
        default: 'Free'
    },
    visitHistory: [{
        timestamp: { type: Date, default: Date.now },
        ip: String,
        location: {
            city: String,
            region: String,
            country: String,
            lat: Number,
            lon: Number,
        },
        userAgent: String
    }],
    expireAt: {
        type: Date,
        default: function () {
            // Expire only if userType is Free; premium users URLs do not expire
            if (this.userType === 'Free') {
                return new Date(Date.now() + 60 * 60 * 1000); // expire in 60 seconds (example)
            }
            return null;
        },
        expires: 60 // MongoDB TTL index, deletes doc 60 seconds after expireAt
    }
}, { timestamps: true });

const URL = mongoose.model('URL', urlSchema);
export default URL;
