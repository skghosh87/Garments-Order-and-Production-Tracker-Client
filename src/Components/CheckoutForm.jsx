import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CheckoutForm = ({ orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // ১. ব্যাকএন্ড থেকে Payment Intent তৈরি করে Secret সংগ্রহ করা
  useEffect(() => {
    if (orderData?.totalPrice > 0) {
      axios
        .post(
          `${import.meta.env.VITE_SERVER_API}/api/v1/create-payment-intent`,
          { price: orderData.totalPrice }
        )
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          console.error("Stripe Secret Error:", err);
          setError("পেমেন্ট গেটওয়ে কানেক্ট করতে সমস্যা হচ্ছে।");
        });
    }
  }, [orderData.totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);
    setError(""); // আগের এরর ক্লিয়ার করা

    // ২. পেমেন্ট কনফার্ম করা
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: orderData?.buyerEmail || "unknown@mail.com",
            name: orderData?.buyerName || "Anonymous",
          },
        },
      });

    if (confirmError) {
      // পেমেন্ট ফেইল হলে যা হবে
      setError(confirmError.message);
      setProcessing(false);
      Swal.fire("পেমেন্ট ব্যর্থ!", confirmError.message, "error");
    } else if (paymentIntent.status === "succeeded") {
      // পেমেন্ট সফল হলে যা হবে
      setTransactionId(paymentIntent.id);

      // ৩. ডাটাবেসে পেমেন্টের তথ্য এবং অর্ডারের স্ট্যাটাস আপডেট করা
      const paymentUpdate = {
        transactionId: paymentIntent.id,
        status: "Paid", // স্ট্যাটাস পরিবর্তন
        paymentDate: new Date(),
      };

      try {
        const res = await axios.patch(
          `${import.meta.env.VITE_SERVER_API}/api/v1/orders/payment/${
            orderData._id
          }`,
          paymentUpdate
        );

        if (res.data.modifiedCount > 0 || res.data.success) {
          setProcessing(false);
          Swal.fire({
            title: "পেমেন্ট সফল!",
            text: `Transaction ID: ${paymentIntent.id}`,
            icon: "success",
            confirmButtonText: "অর্ডার দেখুন",
          }).then(() => {
            navigate("/dashboard/my-orders"); // সফল হলে ইউজারকে নিয়ে যাবে
          });
        }
      } catch (dbError) {
        console.error("Database Update Error:", dbError);
        toast.error(
          "পেমেন্ট সফল হলেও ডাটাবেস আপডেট হয়নি। সাপোর্ট টিমে যোগাযোগ করুন।"
        );
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-5 border border-blue-100 rounded-2xl bg-gray-50 shadow-inner">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#1a1a1a",
                fontFamily: "Inter, sans-serif",
                "::placeholder": { color: "#9ca3af" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <div className="space-y-2">
        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
            processing
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {processing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay $${orderData?.totalPrice}`
          )}
        </button>

        {transactionId && (
          <p className="text-green-600 text-xs font-bold text-center">
            Success! Transaction ID: {transactionId}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-red-500 text-xs font-bold text-center">
            ⚠️ {error}
          </p>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
