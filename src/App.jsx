import Header from "./components/header/Header";
import './App.css'
import MasterLayout from "./layouts/MasterLayout";
import Footer from "./components/footer/Footer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./pages/client/Home";
import AdminLayout from "./layouts/AdminLayout";
import ManageUser from "./pages/admin/ManageUser";
import ManageProduct from "./pages/admin/ManageProducts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCategory from "./pages/admin/ManageCategory";
import Products from "./pages/client/Products";
import Support from "./pages/client/Support";
import About from "./pages/client/About";
import Cart from "./pages/client/Cart";
import AccountInfo from "./pages/client/Profile";
import ProductDetail from "./pages/client/ProductDetail";
import Order from "./pages/client/Order";
import OrderDetails from "./pages/client/OrderDetail";
import ManageOrder from "./pages/admin/ManageOrder";
// Định nghĩa các route ở đây
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <MasterLayout>
          <Home />
        </MasterLayout>
        <Footer />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Header />
        <MasterLayout>
          <Login />
        </MasterLayout>
        <Footer />
      </>
    ),
  },

  {
    path: "/profile",
    element: (
      <>
        <Header />
        <MasterLayout>
          <AccountInfo />
        </MasterLayout>
        <Footer />
      </>
    ),
  },
  {
    path: "/register",
    element: (<>
      <Header />
      <MasterLayout>
        <Register />
      </MasterLayout>
      <Footer />
    </>
    )
  },
  {
    path: "/products",
    element: (<>
      <Header />
      <MasterLayout>
        <Products />
      </MasterLayout>
      <Footer />
    </>
    )
  },
  {
    path: "/product/:productId",
    element: (<>
      <Header />
      <MasterLayout>
        <ProductDetail />
      </MasterLayout>
      <Footer />
    </>
    )
  },
  {
    path: "/support",
    element: (<>
      <Header />
      <MasterLayout>
        <Support />
      </MasterLayout>
      <Footer />
    </>
    )
  },
  {
    path: "/about",
    element: (<>
      <Header />
      <MasterLayout>
        <About />
      </MasterLayout>
      <Footer />
    </>
    )
  },
  {
    path: "/cart",
    element: (<>
    <Header />
    <MasterLayout>
      <Cart />
    </MasterLayout>
    <Footer />
    </>)
  },
  {
    path: "/order",
    element: (<>
    <Header />
    <MasterLayout>
      <Order />
    </MasterLayout>
    <Footer />
    </>)
  },
  {
    path: "/order-detail",
    element: (<>
      <Header />
      <MasterLayout>
        <OrderDetails />
      </MasterLayout>
      <Footer />
    </>)
  },
  {
    path: "/admin",
    element: (
      <>
      <AdminLayout />
      </>
    ),
    children: [
      {
        path:"manageusers",
        element: <ManageUser />
      },
      {
        path:"manageproducts",
        element: <ManageProduct />
      },
      {
        path:"dashboard",
        element: <AdminDashboard />
      },
      {
        path:"managecategory",
        element: <ManageCategory />
      },
      {
        path:"manageorder",
        element: <ManageOrder />
      }
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} /> // Dùng RouterProvider để cung cấp router
  );
}

export default App;
