// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["admin","manager","employee"], default: "employee" },
  managerOf: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // managers -> employees (optional)
}, { timestamps: true });

// password hash pre-save
UserSchema.pre("save", function(next){
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

// instance method to compare password
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model("User", UserSchema);
