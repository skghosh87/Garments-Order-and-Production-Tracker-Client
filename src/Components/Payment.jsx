import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Container from "./Shared/Container";
// আপনার Publishable Key টি এখানে দিন
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  // এখানে আপনি রিঅ্যাক্ট রাউটার থেকে অর্ডারের ডাটা নিতে পারেন (যেমন: state বা params দিয়ে)
  const orderData = { totalPrice: 100, buyerEmail: "user@example.com" };

  return (
    <Container className="py-20 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-black text-center mb-8 uppercase italic italic">
          Complete Payment
        </h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm orderData={orderData} />
        </Elements>
      </div>
    </Container>
  );
};

export default Payment;
