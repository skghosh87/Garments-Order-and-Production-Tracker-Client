import { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaBoxOpen } from "react-icons/fa";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedOrders = async () => {
    setLoading(true);
    try {
      // এই এপিআই কলটি ব্যাকএন্ডের অ্যাগ্রিগেশন লজিক ব্যবহার করে শুধু এই ম্যানেজারের ডাটা আনবে
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/api/v1/orders/approved`,
        { withCredentials: true }
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching approved orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <FaSpinner className="animate-spin text-5xl text-green-600" />
        <p className="text-gray-500 font-medium italic">
          Loading approved orders...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <FaCheckCircle className="text-2xl text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Approved Orders
          </h1>
          <p className="text-sm text-gray-500">
            Orders that have been confirmed for production
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <FaBoxOpen className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No approved orders found for your products.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="table w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr className="text-gray-700 dark:text-gray-200">
                <th className="py-4 px-6 text-left">#</th>
                <th className="py-4 px-6 text-left">Buyer Details</th>
                <th className="py-4 px-6 text-left">Product</th>
                <th className="py-4 px-6 text-center">Quantity</th>
                <th className="py-4 px-6 text-right">Total Amount</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-green-50/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {order.buyerName || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500 font-mono italic">
                        {order.buyerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {order.productName}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-medium">
                    {order.orderQuantity || order.quantity}{" "}
                    <span className="text-[10px] text-gray-400 uppercase">
                      pcs
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-gray-900 dark:text-white">
                    ${order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-4 py-1.5 rounded-full text-[11px] font-black bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 uppercase tracking-tighter shadow-sm border border-green-200 dark:border-green-800">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovedOrders;
