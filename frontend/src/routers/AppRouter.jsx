import { Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// Import Pages
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Registration";
import CustomerReg from "../auth/CustomerReg";
import VendorReg from "../auth/VendorReg";
import About from "../components/About";
import Contact from "../components/Contact";
import Search from "../pages/search/Search";
import BrandPage from "../pages/brands/BrandPage";
import WebcamCapture from "../pages/home/WebcamCapture";
import Checkout from "../pages/products/CheckoutPage";
import ProductPage from "../pages/products/ProductPage";
import SingleProduct from "../pages/products/SingleProduct";
import PaymentSuccess from "../pages/orders/PaymentSuccess";
import ViewOrders from "../pages/orders/ViewOrders";

// Vendor Pages
import Vendor from "../pages/layout/Vendor";
import VendorDashboard from "../pages/layout/DashboardSideBar";
import CreateProduct from "../pages/shop/CreateProduct";
import AllProducts from "../pages/shop/AllProducts";
import EditProducts from "../pages/shop/EditProducts";
import { useSelector } from "react-redux";

const AppRouter = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path={routes.home} element={user?.role === "vendor" ? <Navigate to="/vendor/dashboard" replace /> : <Home />} />
      <Route path={routes.about} element={<About />} />
      <Route path={routes.contact} element={<Contact />} />
      <Route path={routes.search} element={<Search />} />
      <Route path={routes.brands} element={<BrandPage />} />
      <Route path={routes.webcam} element={<WebcamCapture />} />
      <Route path={routes.product} element={<ProductPage />} />
      <Route path={routes.singleProduct} element={<SingleProduct />} />
      <Route path={routes.payment} element={<PaymentSuccess />} />

      {/* Authentication Routes */}
      <Route element={<PublicRoute />}>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.register} element={<Register />}>
          <Route path="customer" element={<CustomerReg />} />
          <Route path="vendor" element={<VendorReg />} />
        </Route>
      </Route>

      {/* Customer Private Routes */}
      <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
        <Route path={routes.checkout} element={<Checkout />} />
        <Route path={routes.orders} element={<ViewOrders />} />
      </Route>

      {/* Vendor Private Routes */}
      <Route element={<PrivateRoute allowedRoles={["vendor"]} />}>
        <Route path={routes.vendor} element={<Vendor />} />
        <Route path={routes.vendorDashboard} element={<VendorDashboard />} />
        <Route path={routes.vendorCreateProduct} element={<CreateProduct />} />
        <Route path={routes.vendorProducts} element={<AllProducts />} />
        <Route path={routes.vendorEditProduct} element={<EditProducts />} />
      </Route>

      {/* Redirect unknown routes */}
      {/* <Route path="*" element={<Navigate to="/" />} /> */}
    </Routes>
  );
};


export default AppRouter;