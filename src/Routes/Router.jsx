import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Home from "../Pages/Home";
import HomeLayout from "../Layouts/HomeLayout";
import ErrorPage from "../Pages/ErrorPage";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import EditProfile from "../Pages/EditProfile";
import MyFoods from "../Pages/MyFoods";
import AddFood from "../Pages/AddFood";
import MyOrders from "../Pages/MyOrders";
import AllFoods from "../Pages/AllFoods";
import Gallery from "../Pages/Gallery";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <Home></Home> ,
            },
            {
                path: "all-foods",
                element: <AllFoods></AllFoods>,
            },
            {
                path: "gallery",
                element: <Gallery></Gallery>,
            },
            {
                path: "edit-profile",
                element: <EditProfile></EditProfile>,
            },
            {
                path: "my-foods",
                element: <MyFoods></MyFoods>,
            },
            {
                path: "add-food",
                element: <AddFood></AddFood>,
            },
            {
                path: "my-orders",
                element: <MyOrders></MyOrders>,
            },
            {
                path: "login",
                element: <Login></Login>,
            },
            {
                path: "register",
                element: <Register></Register>,
            },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
