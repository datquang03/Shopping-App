import { Metadata } from "next";
import FormRegister from "./Form";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Register() {
  return <FormRegister />;
}
