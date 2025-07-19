import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pass: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  uname: {
    type: String,
  },
  githubConnect: {
    type: Boolean,
    default: false,
  },
  organizationsContributedTo: {
    type: [String],
    default: [],
  },
  accessToken: {
    type: String,
  },
  bio: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['student', 'workingProfessional'],
    required: true,
  },
  companyName: {
    type: String,
    default: '',
  },
  githubProfileLink: {
    type: String,
    default: '',
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
