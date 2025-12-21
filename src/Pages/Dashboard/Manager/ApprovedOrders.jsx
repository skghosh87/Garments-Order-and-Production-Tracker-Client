import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaSpinner,
  FaPlus,
  FaEye,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaHistory,
  FaBoxOpen,
} from "react-icons/fa";

const ApprovedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const API_URL = import.meta.env.VITE_SERVER_API;

  // ১. এপ্রুভড অর্ডার ফেচ করা
  const fetchApprovedOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/v1/manager/approved-orders`, {
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedOrders();
  }, []);

  // ২. ট্র্যাকিং আপডেট সাবমিট হ্যান্ডলার
  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    const form = e.target;
    const trackingData = {
      status: form.status.value,
      location: form.location.value,
      note: form.note.value,
      updatedAt: new Date(),
    };

    try {
      const res = await axios.patch(
        `${API_URL}/api/v1/orders/update-tracking/${selectedOrder._id}`,
        trackingData,
        { withCredentials: true }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire("Success!", "নতুন ট্র্যাকিং আপডেট যোগ করা হয়েছে।", "success");
        form.reset();
        document.getElementById("tracking_modal").close();
        fetchApprovedOrders(); // লিস্ট রিফ্রেশ (অর্ডারটি এখানেই থাকবে)
      }
    } catch (err) {
      Swal.fire("Error", "আপডেট করা সম্ভব হয়নি।", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 min-h-screen">
      <div className="flex items-center gap-4 mb-8 bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <FaCheckCircle className="text-3xl text-indigo-600" />
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase">
            Approved Orders
          </h2>
          <p className="text-indigo-600 text-sm font-bold italic">
            Manage production tracking & timeline
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-separate border-spacing-y-2">
          <thead className="bg-gray-50 text-gray-600 uppercase text-[11px] font-black tracking-widest text-center">
            <tr>
              <th className="py-4">Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Current Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-20 text-gray-400 italic"
                >
                  No approved orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white hover:bg-gray-50 transition-all shadow-sm border border-gray-100 text-center"
                >
                  <td className="font-mono text-xs text-indigo-600 font-bold">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="font-bold text-gray-800">{order.buyerName}</td>
                  <td className="font-bold">{order.productName}</td>
                  <td className="font-black text-gray-600">
                    {order.orderQuantity} PCS
                  </td>
                  <td>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                      {order.currentTrackingStatus || "Ready to Start"}
                    </span>
                  </td>
                  <td className="flex justify-center gap-2 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        document.getElementById("tracking_modal").showModal();
                      }}
                      className="btn btn-xs bg-indigo-600 text-white hover:bg-indigo-700 gap-1 border-none shadow-md shadow-indigo-100"
                    >
                      <FaPlus className="text-[10px]" /> Add Update
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        document
                          .getElementById("view_tracking_modal")
                          .showModal();
                      }}
                      className="btn btn-xs btn-outline btn-info gap-1"
                    >
                      <FaEye className="text-[10px]" /> View Tracking
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL 1: ADD TRACKING UPDATE --- */}
      <dialog id="tracking_modal" className="modal">
        <div className="modal-box rounded-3xl max-w-md">
          <h3 className="font-black text-xl text-gray-800 uppercase mb-6 flex items-center gap-2 border-b pb-4">
            <FaMapMarkerAlt className="text-indigo-600" /> New Production Step
          </h3>
          <form onSubmit={handleUpdateTracking} className="space-y-4">
            <div className="form-control">
              <label className="label text-xs font-bold uppercase text-gray-500">
                Current Step
              </label>
              <select
                name="status"
                className="select select-bordered w-full rounded-xl bg-gray-50 font-bold"
                required
              >
                <option value="Cutting Completed">Cutting Completed</option>
                <option value="Sewing Started">Sewing Started</option>
                <option value="Finishing">Finishing</option>
                <option value="QC Checked">QC Checked</option>
                <option value="Packed">Packed</option>
                <option value="Shipped / Out for Delivery">
                  Shipped / Out for Delivery
                </option>
              </select>
            </div>
            <div className="form-control">
              <label className="label text-xs font-bold uppercase text-gray-500">
                Factory Location
              </label>
              <input
                name="location"
                type="text"
                placeholder="e.g. Gazipur Factory, Floor 2"
                className="input input-bordered w-full rounded-xl focus:border-indigo-500"
                required
              />
            </div>
            <div className="form-control">
              <label className="label text-xs font-bold uppercase text-gray-500">
                Progress Note
              </label>
              <textarea
                name="note"
                className="textarea textarea-bordered w-full rounded-xl h-24"
                placeholder="Any specific details or issues..."
              ></textarea>
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn bg-indigo-600 text-white rounded-xl w-full border-none shadow-lg"
              >
                Save Update
              </button>
            </div>
          </form>
          <button
            onClick={() => document.getElementById("tracking_modal").close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          >
            ✕
          </button>
        </div>
      </dialog>

      {/* --- MODAL 2: VIEW TRACKING TIMELINE --- */}
      <dialog id="view_tracking_modal" className="modal">
        <div className="modal-box rounded-3xl max-w-lg bg-gray-50 scrollbar-hide">
          <h3 className="font-black text-xl text-gray-800 uppercase mb-8 flex items-center gap-2 border-b pb-4">
            <FaHistory className="text-blue-600" /> Movement Timeline
          </h3>

          <div className="relative border-l-2 border-dashed border-indigo-200 ml-4 space-y-8 pb-4">
            {selectedOrder?.trackingHistory?.length > 0 ? (
              [...selectedOrder.trackingHistory]
                .reverse()
                .map((step, index) => (
                  <div key={index} className="relative ml-8">
                    <span className="absolute -left-12 top-0 flex items-center justify-center w-8 h-8 bg-white border-2 border-indigo-500 rounded-full z-10">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </span>
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight">
                          {step.status}
                        </h4>
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {new Date(step.updatedAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium mb-2">
                        <FaMapMarkerAlt className="text-red-400" />{" "}
                        {step.location}
                      </p>
                      {step.note && (
                        <p className="text-[11px] bg-gray-50 p-3 rounded-xl text-gray-600 border-l-2 border-indigo-400 italic">
                          "{step.note}"
                        </p>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-10 flex flex-col items-center gap-3">
                <FaBoxOpen className="text-4xl text-gray-200" />
                <p className="text-gray-400 font-bold italic">
                  No tracking history yet. Start by adding an update!
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() =>
              document.getElementById("view_tracking_modal").close()
            }
            className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ApprovedOrders;
