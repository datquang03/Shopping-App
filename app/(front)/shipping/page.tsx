import { Metadata } from "next";
import ShippingForm from "./Form";

export const metadata: Metadata = {
  title: "Shipping Address",
};

export default async function ShippingPage() {
  return <ShippingForm />;
}
