import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Container from "./Shared/Container";
import { useLoaderData } from "react-router-dom";

// স্ট্রাইপ পাবলিশেবল কি (Stripe Publishable Key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  /**
   * ডায়নামিক ডাটা হ্যান্ডলিং:
   * আপনার রাউট (Routes.jsx) ফাইলে এই পেজের জন্য একটি 'loader' থাকতে হবে।
   * যা ডাটাবেস থেকে ওই নির্দিষ্ট আইডির অর্ডারের তথ্য নিয়ে আসবে।
   */
  const orderData = useLoaderData();

  // সেফটি চেক: ডাটা লোড না হওয়া পর্যন্ত একটি স্পিনার দেখাবে
  if (!orderData || !orderData.totalPrice) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <Container className="py-20 min-h-screen">
      <div className="max-w-md mx-auto bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        {/* টাইটেল */}
        <h2 className="text-2xl font-black text-center mb-8 uppercase italic tracking-wider text-gray-800">
          Complete Payment
        </h2>

        {/* অর্ডার সামারি (ঐচ্ছিক কিন্তু ইউজার এক্সপেরিয়েন্সের জন্য ভালো) */}
        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-gray-600 flex justify-between">
            <span>Payable Amount:</span>
            <span className="font-bold text-blue-700">
              ${orderData.totalPrice}
            </span>
          </p>
        </div>

        {/* স্ট্রাইপ এলিমেন্টস */}
        <Elements stripe={stripePromise}>
          {/* এখানে এখন ডায়নামিক orderData পাস হচ্ছে */}
          <CheckoutForm orderData={orderData} />
        </Elements>
      </div>
    </Container>
  );
};

export default Payment;
