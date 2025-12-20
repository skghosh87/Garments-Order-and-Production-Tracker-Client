import { useEffect, useState } from "react";
import { FaSpinner, FaCheckCircle, FaBoxOpen } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure(); // সুরক্ষিত এক্সিওস হুক ব্যবহার

  const fetchApprovedOrders = async () => {
    setLoading(true);
    try {
      // ব্যাকএন্ড থেকে শুধুমাত্র অ্যাপ্রুভড অর্ডারগুলো আনা হচ্ছে
      const res = await axiosSecure.get("/api/v1/orders/approved");
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
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <FaCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Approved Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Confirmed orders ready for production/delivery
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <FaBoxOpen className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No approved orders found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr className="text-gray-700 dark:text-gray-200 border-b dark:border-gray-600">
                <th className="py-4 px-6">#</th>
                <th className="py-4 px-6">Buyer Details</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6 text-center">Quantity</th>
                <th className="py-4 px-6 text-right">Total Price</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-green-50/30 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  <td className="py-4 px-6 font-medium text-gray-400">
                    {index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {order.buyerName || "Customer"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {order.buyerEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      {order.productName}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-gray-700 dark:text-gray-300">
                    {order.orderQuantity || order.quantity}
                    <span className="text-[10px] ml-1 text-gray-400 uppercase">
                      pcs
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-gray-900 dark:text-white">
                    ${order.totalPrice?.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
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
