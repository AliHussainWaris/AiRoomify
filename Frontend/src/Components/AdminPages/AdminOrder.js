import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const AdminOrder = () => {
  const [orders, setOrders] = useState([]); // To store orders
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all"); // To filter orders by status
  const itemsPerPage = 10;

  // Load orders from the API when the component mounts or when the page changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/order/all");
        setOrders(response.data); // Assuming the API returns an array of orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handleDelete = async (orderId) => {
    try {
      const userId = localStorage.getItem("userId"); // Get user ID from local storage
      await axios.delete("http://localhost:5000/api/order/delete", {
        data: { user_id: userId, order_id: orderId },
      });
      alert("Order deleted successfully!");
      setOrders(orders.filter(order => order.order_id !== orderId)); // Update the order list after deletion
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order.");
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value); // Update filter status
  };

  // Filter orders based on status
  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="w-[90%] bg-white text-black rounded-lg p-4">
      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="border rounded-md p-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2 text-left">Order#</th>
            <th className="p-2 text-left">Product</th>
            <th className="p-2 text-left">Quantity</th>
            <th className="p-2 text-left">View</th>
            <th className="p-2 text-left">Edit</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.slice(indexOfFirstItem, indexOfLastItem).map((order, index) => (
            <tr key={order.order_id} className="odd:bg-white even:bg-gray-100 border-t">
              <td className="p-2">{order.order_id}</td>
              <td className="p-2">{order.product_name}</td>
              <td className="p-2">{order.quantity}</td>
              <td className="p-2">
                <FontAwesomeIcon
                  icon={faEye}
                  className="text-green-500 cursor-pointer"
                />
              </td>
              <td className="p-2">
                <FontAwesomeIcon
                  icon={faPencil}
                  className="text-blue-500 cursor-pointer"
                />
              </td>
              <td className="p-2">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(order.order_id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-full ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
