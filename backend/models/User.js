const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// This is like an @Entity class in JPA — it defines the shape of a
// "user" document in MongoDB, plus validation rules.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Mongo will enforce no duplicate emails
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Mongoose "pre-save hook" — this runs automatically right before a
// user document is saved. Equivalent to encoding the password inside
// a @PrePersist method, or before calling save() in a Spring service.
userSchema.pre("save", async function (next) {
  // Only re-hash the password if it was actually changed/created.
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method available on every user document, e.g. user.comparePassword(...)
// Same idea as Spring Security's PasswordEncoder.matches(raw, encoded)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
