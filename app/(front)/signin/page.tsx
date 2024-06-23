import { Metadata } from "next";
import FormSignIn from "./Form";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignIn() {
  return <FormSignIn />;
}
