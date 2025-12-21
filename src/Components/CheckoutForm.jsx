import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const totalPrice = bookingData?.price * bookingData?.quantity;

  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecure
        .post("/api/v1/create-payment-intent", { price: totalPrice })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [axiosSecure, totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
      setProcessing(false);
      return;
    }

    // পেমেন্ট কনফার্ম করা
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      Swal.fire("Error", confirmError.message, "error");
    } else {
      if (paymentIntent.status === "succeeded") {
        setTransactionId(paymentIntent.id);

        // ডাটাবেসে পেমেন্ট এবং অর্ডার ইনফো সেভ করা
        const paymentInfo = {
          ...bookingData,
          transactionId: paymentIntent.id,
          date: new Date(),
          status: "paid",
        };

        const res = await axiosSecure.post("/api/v1/orders", paymentInfo);
        if (res.data.insertedId) {
          Swal.fire(
            "Success",
            `Payment successful! TrxID: ${paymentIntent.id}`,
            "success"
          );
          navigate("/dashboard/my-orders");
        }
      }
    }
    setProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto p-6 bg-gray-50 rounded-lg"
    >
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      <button
        className="btn btn-primary btn-sm mt-8 w-full"
        type="submit"
        disabled={!stripe || !clientSecret || processing}
      >
        {processing ? "Processing..." : `Pay $${totalPrice}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
