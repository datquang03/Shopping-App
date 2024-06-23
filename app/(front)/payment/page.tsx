import { Metadata } from "next";
import PaymentForm from "./Form";

export const metatada: Metadata = {
  title: "Payment Method",
};

export default async function PaymentMethodPage() {
  return <PaymentForm />;
}
