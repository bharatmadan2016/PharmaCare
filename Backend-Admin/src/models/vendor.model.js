import mongoose, { Schema } from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    licenseNumber: String,
    shopName: String,
    addressStreet: String,
    addressCity: String,
    addressState: String,
    addressPincode: String,
    latitude: Number,
    longitude: Number,
    openingTime: String,
    closingTime: String,
    phone: String,
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const VendorProfile = mongoose.model("VendorProfile", vendorSchema);
