import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { UserInfo } from "@/models/UserInfo";
import mongoose from "mongoose";

// Connect to MongoDB only if not connected
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const data = await req.json();
    const { _id, name, image, ...otherUserInfo } = data;

    let filter = {};
    if (_id) {
      filter = { _id };
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
      }
      filter = { email: session.user.email };
    }

    let user;
    try {
      user = await User.findOne(filter);
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }
    } catch (e) {
      console.error("Error finding user:", e);
      return new Response(JSON.stringify({ error: "Database error on find user" }), { status: 500 });
    }

    try {
      await User.updateOne(filter, { name, image });
    } catch (e) {
      console.error("Error updating user:", e);
      return new Response(JSON.stringify({ error: "Database error on update user" }), { status: 500 });
    }

    try {
      await UserInfo.findOneAndUpdate({ email: user.email }, otherUserInfo, { upsert: true });
    } catch (e) {
      console.error("Error updating user info:", e);
      return new Response(JSON.stringify({ error: "Database error on update user info" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("PUT /api/profile general error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    let filterUser = {};

    if (_id) {
      filterUser = { _id };
    } else {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return new Response(JSON.stringify({}), { status: 200 });
      }
      filterUser = { email: session.user.email };
    }

    const user = await User.findOne(filterUser).lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const userInfo = await UserInfo.findOne({ email: user.email }).lean();

    return new Response(JSON.stringify({ ...user, ...(userInfo || {}) }), { status: 200 });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
    });
  }
}



// 'use client';
// import EditableImage from "@/components/layout/EditableImage";
// import InfoBox from "@/components/layout/InfoBox";
// import SuccessBox from "@/components/layout/SuccessBox";
// import UserForm from "@/components/layout/UserForm";
// import UserTabs from "@/components/layout/UserTabs";
// import {useSession} from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import {redirect} from "next/navigation";
// import {useEffect, useState} from "react";
// import toast from "react-hot-toast";

// export default function ProfilePage() {
//   const session = useSession();

//   const [user, setUser] = useState(null);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [profileFetched, setProfileFetched] = useState(false);
//   const {status} = session;

//   useEffect(() => {
//     if (status === 'authenticated') {
//       fetch('/api/profile').then(response => {
//         response.json().then(data => {
//           setUser(data);
//           setIsAdmin(data.admin);
//           setProfileFetched(true);
//         })
//       });
//     }
//   }, [session, status]);

//   async function handleProfileInfoUpdate(ev, data) {
//     ev.preventDefault();

//     const savingPromise = new Promise(async (resolve, reject) => {
//       const response = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(data),
//       });
//       if (response.ok)
//         resolve()
//       else
//         reject();
//     });

//     await toast.promise(savingPromise, {
//       loading: 'Saving...',
//       success: 'Profile saved!',
//       error: 'Error',
//     });

//   }

//   if (status === 'loading' || !profileFetched) {
//     return 'Loading...';
//   }

//   if (status === 'unauthenticated') {
//     return redirect('/login');
//   }

//   return (
//     <section className="mt-8">
//       <UserTabs isAdmin={isAdmin} />
//       <div className="max-w-2xl mx-auto mt-8">
//         <UserForm user={user} onSave={handleProfileInfoUpdate} />
//       </div>
//     </section>
//   );
// }