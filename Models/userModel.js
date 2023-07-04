const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

//mongodb builtin function
userSchema.pre("save",async function(next){

    if(!this.isModified("password"))
    {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//mongodb custom function
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (error) {
      throw new Error(error);
    }
  };

const User = mongoose.model("User", userSchema);
module.exports = User;
