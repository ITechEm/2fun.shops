import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import mongoose from 'mongoose';
import { User } from '@/models/User';
import bcrypt from 'bcrypt';

async function connectToDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to MongoDB');
    return;
  }
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URL);
  console.log('Connected to MongoDB');
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorize called with:', credentials);
        try {
          await connectToDB();
          console.log('Finding user by email:', credentials.email);
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log('User not found');
            throw new Error('Email or password incorrect');
          }
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log('Invalid password');
            throw new Error('Email or password incorrect');
          }
          console.log('User authenticated:', user.email);
          return { id: user._id.toString(), email: user.email };
        } catch (err) {
          console.error('Authorize error:', err);
          throw new Error(err.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.SECRET,
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };