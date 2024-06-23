import { Metadata } from "next";
import PlaceOrderForm from "./Form";

export const metadata: Metadata = {
  title: "Place Order",
};

export default async function PlaceOrderPage() {
  return <PlaceOrderForm />;
}
