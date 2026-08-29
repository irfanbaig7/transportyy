const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: String,
    number: String,
    year: String,
    type: { type: String, default: '4 Wheeler' },
    color: String,
    ac: { type: Boolean, default: false },
  },
  { _id: false }
);

const documentsSchema = new mongoose.Schema(
  {
    licenseUrl: String,
    rcUrl: String,
    insuranceUrl: String,
    photoUrl: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    city: { type: String, trim: true },

    role: { type: String, enum: ['passenger', 'driver'], default: 'passenger' },
    isAvailable: { type: Boolean, default: false }, // driver online/offline toggle
    verified: { type: Boolean, default: false },

    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    tripsCount: { type: Number, default: 0 },

    car: carSchema,
    documents: documentsSchema,
    driverProfileComplete: { type: Boolean, default: false },

    // Forgot-password OTP flow (mock — see authRoutes.js)
    resetOtp: String,
    resetOtpExpires: Date,
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetOtp;
  delete obj.resetOtpExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);