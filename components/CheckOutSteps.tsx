const CheckOutSteps = ({ current = 0 }) => {
  const steps = [
    "User Login",
    "Shipping Address",
    "Payment Method",
    "Place Order",
  ];

  return (
    <ul className="steps steps-vertical lg:steps-horizontal w-full mt-4">
      {steps.map((step, index) => (
        <li
          key={step}
          className={`step ${
            index <= current ? "step-primary text-black" : ""
          }`}
        >
          <span
            className={`step-number ${
              index <= current ? " text-white" : "bg-gray-300 text-black"
            }`}
          ></span>
          <span className="step-label ml-2">{step}</span>
        </li>
      ))}
    </ul>
  );
};

export default CheckOutSteps;
