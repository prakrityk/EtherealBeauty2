import React from "react";
import { useSelector } from "react-redux";
import { useCurrentIds } from '../../features/authHelpers';
import { useGetCustomerOrdersQuery } from "../../features/orders/orderApi";
import { useFetchAllProductsQuery } from "../../features/products/productsApi";

const ViewOrders = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <p className="text-center text-gray-500">Please log in to proceed with checkout.</p>;
  }
  // Get the associated customerId from your auth state
const { customerId, role } = useCurrentIds();
console.log("customerId", customerId);
  // If there's no associated customerId (or if the logged-in user is not a customer), show a message
  if (role !== 'customer'){
    return <p className="text-center text-gray-500">Please log in as a customer to view your orders.</p>;
  }

  // Fetch orders using the customerId from the auth state
  const { data: orders, error, isLoading } = useGetCustomerOrdersQuery(customerId);

  // Fetch all products
  const { data: products } = useFetchAllProductsQuery();

  if (isLoading)
    return <p className="text-center text-gray-500">Loading orders...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        Error fetching orders: {error.message}
      </p>
    );
  if (!orders?.length)
    return <p className="text-center text-gray-500">No orders found.</p>;

  // Helper function to get the product name by its ID
  const getProductName = (productId) => {
    if (!products || !Array.isArray(products)) return "Loading...";
    return products.find((p) => p.product_id === productId)?.name || "Unknown Product";
  };

  return (
    <div className="section__container">
      <h2 className="uppercase myh2 mb-2 mt-0">Your Orders</h2>
      <div className="section__container header__container">
        {[...orders].reverse().map((order) => (
          <div
            key={order.order_id}
            className="border border-pink-300 p-6 rounded-2xl mb-8 shadow-md bg-white hover:shadow-xl transition-shadow"
          >
            <p className="text-xl font-semibold text-pink-700">
              Order ID: <span className="font-normal text-gray-600">{order.order_id}</span>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Status:</strong>
              <span
                className={`ml-2 px-3 py-1 rounded-lg text-white text-sm ${
                  order.status === "Pending" ? "bg-yellow-500" : "bg-green-600"
                }`}
              >
                {order.status || "Pending"}
              </span>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Total Amount:</strong>{" "}
              <span className="text-lg font-medium text-pink-400">NPR {order.total_price}</span>
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Payment Method:</strong> {order.payment_method}
            </p>
            <h4 className="mt-4 font-semibold text-pink-700 text-lg">Ordered Items:</h4>
            <ul className="mt-3 space-y-2">
              {order.orderItems?.map((item) => (
                <li
                  key={item.order_item_id}
                  className="ml-4 pl-2 border-l-4 border-pink-300 text-gray-700"
                >
                  <span className="text-lg font-medium text-pink-400">
                    {item.quantity}x
                  </span>{" "}
                  {getProductName(item.product_id)} -{" "}
                  <span className="font-semibold text-gray-900">
                    NPR {item.subtotal}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewOrders;
