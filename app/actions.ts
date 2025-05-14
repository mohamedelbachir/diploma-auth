"use server";
import { getIronSession } from "iron-session";
import { defaultSession, SessionData, sessionOptions } from "@/lib";
import { cookies } from "next/headers";
import { accoutType } from "@/types/type";
import { redirect } from "next/navigation";

// let userCredentials: {
//   email: string;
//   password: string;
//   accountType: accoutType;
//   img: string;
// }[] = [
//     {
//       email: "user@gmail.com",
//       password: "user123",
//       accountType: "USER",
//       img: "/avatar/avatar-1.png",
//     },
//     {
//       email: "startup@gmail.com",
//       password: "startup123",
//       accountType: "START-UP",
//       img: "/brand/sharkink.webp",
//     },
//     {
//       email: "investor@gmail.com",
//       password: "invest123",
//       accountType: "INVESTOR",
//       img: "/brand/investor-1.png",
//     },
//   ];
export const getSession = async () => {
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) {
    session.user = defaultSession.user;
  }
  return session;
};
export const login = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let profile="student"

  try {
    // Call to backend API for JWT authentication
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    if (!response.ok) {
      console.log("Authentication failed");
      return { error: "Invalid credentials" };
    }

    const data = await response.json();

    // Get token from response
    const { access, refresh } = data;

    // Get user information using the access token from the dashboard endpoint
    const userResponse = await fetch(`${process.env.BACKEND_API_URL}/auth/dashboard/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access}`,
      },
    });

    if (!userResponse.ok) {
      return { error: "Failed to get user information" };
    }

    const dashboardData = await userResponse.json();
    const userData = dashboardData.user;

    // Get user session
    const session = await getSession();

    // Update session with user data and token
    session.user = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role,
      is_superuser: userData.is_superuser,
      is_staff: userData.is_staff,
      date_joined: new Date(userData.date_joined),
      last_login: userData.last_login ? new Date(userData.last_login) : null,
      token: access
    };

    await session.save();
    profile=userData.role;
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Authentication failed" };
  }finally{
      if (profile === "student") {
        redirect("/profil");
      } else {
        redirect("/admin");
      }
  }
};
export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/login");
};
