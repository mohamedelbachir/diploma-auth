"use server";
import { getIronSession } from "iron-session";
import { defaultSession, SessionData, sessionOptions } from "@/lib";
import { cookies } from "next/headers";
import { accoutType } from "@/types/type";
import { redirect } from "next/navigation";

let userCredentials: {
  email: string;
  password: string;
  accountType: accoutType;
  img: string;
}[] = [
    {
      email: "user@gmail.com",
      password: "user123",
      accountType: "USER",
      img: "/avatar/avatar-1.png",
    },
    {
      email: "startup@gmail.com",
      password: "startup123",
      accountType: "START-UP",
      img: "/brand/sharkink.webp",
    },
    {
      email: "investor@gmail.com",
      password: "invest123",
      accountType: "INVESTOR",
      img: "/brand/investor-1.png",
    },
  ];
export const getSession = async () => {
  let session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.user) {
    session.user = defaultSession.user;
  }
  return session;
};
export const login = async (
  formData: FormData
) => {

  let session = await getSession();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let datas: { role?: string; img?: string } = {};
  if (
    !userCredentials.some((obj) => {
      return obj["email"] === email && obj["password"] === password;
    })
  ) {
    console.log("Wrong credentails")
    return { error: "Wrong credentails" };
  }
  console.log(email, password)
  session.user = {
    userId: email,
    username: email.split("@")[0],
    //account:datas.role as accoutType,
    //img:datas.img
  };
  //session.user.account = datas.role as accoutType;
  //session.user.img = datas.img;
  //session.user!.username = email.split("@")[0];
  await session.save();
  redirect("/profil");
};
export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/login");
};
