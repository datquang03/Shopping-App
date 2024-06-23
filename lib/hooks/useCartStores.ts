import { create } from "zustand";
import { OrderItems, ShippingAddress } from "../models/OrderModels";
import { round2 } from "../utils";
import { persist } from "zustand/middleware";

type Cart = {
  items: OrderItems[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  increase: (item: OrderItems) => void;
  decrease: (item: OrderItems) => void;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  saveShippingAddress: (shippingAddress: ShippingAddress) => void;
  savePaymentMethod: (paymentMethod: string) => void;
  clear: () => void;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  increase: () => {},
  decrease: () => {},
  paymentMethod: "Paypal",
  shippingAddress: {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  },
  saveShippingAddress: () => {},
  savePaymentMethod: () => {},
  clear: () => {},
};

export const cartStore = create<Cart>()(
  persist(
    (set) => ({
      ...initialState,
      increase: (item: OrderItems) => {
        set((state) => {
          const exist = state.items.find((x) => x.slug === item.slug);
          const updatedCartItems = exist
            ? state.items.map((x) =>
                x.slug === item.slug
                  ? { ...exist, quantity: exist.quantity + 1 }
                  : x
              )
            : [...state.items, { ...item, quantity: 1 }];
          const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
            calcPrice(updatedCartItems);
          return {
            items: updatedCartItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          };
        });
      },
      decrease: (item: OrderItems) => {
        set((state) => {
          const exist = state.items.find((x) => x.slug === item.slug);
          if (!exist) return state;
          const updatedCartItems =
            exist.quantity === 1
              ? state.items.filter((x) => x.slug !== item.slug)
              : state.items.map((x) =>
                  x.slug === item.slug
                    ? { ...exist, quantity: exist.quantity - 1 }
                    : x
                );
          const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
            calcPrice(updatedCartItems);
          return {
            items: updatedCartItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          };
        });
      },
      saveShippingAddress: (shippingAddress: ShippingAddress) => {
        set({ shippingAddress });
      },
      savePaymentMethod: (paymentMethod: string) => {
        set({ paymentMethod });
      },
      clear: () => {
        set({
          items: [],
          itemsPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cartStore",
    }
  )
);

const calcPrice = (items: OrderItems[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10); // Assuming 10 as the shipping cost for itemsPrice <= 100
  const taxPrice = round2(Number(0.15 * itemsPrice));
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export default function useCartService() {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase,
    decrease,
    shippingAddress,
    paymentMethod,
    saveShippingAddress,
    savePaymentMethod,
    clear,
  } = cartStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase,
    decrease,
    shippingAddress,
    paymentMethod,
    saveShippingAddress,
    savePaymentMethod,
    clear,
  };
}
