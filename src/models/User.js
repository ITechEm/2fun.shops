import mongoose from 'mongoose';

// Define the schema for the user
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

// Ensure that the User model is only created once
const User = mongoose.models.User || mongoose.model('User', userSchema);

export { User };



// import {model, models, Schema} from "mongoose";
// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   name: {type: String},
//   email: {type: String, required: true, unique: true},
//   password: {type: String},
//   image: {type: String},
// }, {timestamps: true});

// export const User = mongoose.models.User || mongoose.model('User', UserSchema);