import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModels, { OrderItems } from "@/lib/models/OrderModels";
import ProductModel from "@/lib/models/ProductModels";
import { round2 } from "@/lib/utils";

const calcPrices = (orderItem: OrderItems[]) => {
  // calculate the items price
  const itemsPrice = round2(
    orderItem.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  // calculate the shipping price
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);

  // calculate the tax price
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)));

  // calculate the total price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { user } = req.auth;

  try {
    const payload = await req.json();

    if (
      !payload ||
      !payload.items ||
      !payload.paymentMethod ||
      !payload.shippingAddress
    ) {
      return Response.json(
        { message: "Invalid payload. Missing required fields." },
        { status: 400 }
      );
    }

    await dbConnect();

    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: any) => x._id) },
      },
      "price"
    );

    const dbOrderItems = payload.items.map((x: any) => ({
      ...x,
      product: x._id,
      price: dbProductPrices.find((p: any) => p._id === x._id)?.price || 0,
      _id: undefined,
    }));

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const newOrder = new OrderModels({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    });

    const createdOrder = await newOrder.save();

    return Response.json(
      { message: "Order has been created", order: createdOrder },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/orders:", error.message);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
});
