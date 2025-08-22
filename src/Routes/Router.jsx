import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from '../Pages/Home'
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
import PrivateRoutes from "./PrivateRoutes";
import FoodDetails from "../Pages/FoodDetails";
import EditFood from "../Pages/EditFood";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout></HomeLayout>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element:<Home></Home> ,
            },
            {
                path: "all-foods",
                element:  <AllFoods></AllFoods>,
            },
            {
                path: "/food-details/:id",
                element: <FoodDetails></FoodDetails>,
                loader: ({params})=>fetch(`http://localhost:5000/food/${params.id}`)
            },
            {
                path: "/edit-food/:id",
                element: <EditFood></EditFood>,
            },
            {
                path: "gallery",
                element: <Gallery></Gallery>,
            },
            {
                path: "edit-profile",
                element: <PrivateRoutes><EditProfile></EditProfile></PrivateRoutes>,
            },
            {
                path: "my-foods",
                element: <PrivateRoutes><MyFoods></MyFoods></PrivateRoutes>,
            },
            {
                path: "my-orders",
                element: <PrivateRoutes><MyOrders></MyOrders></PrivateRoutes>,
            },
            {
                path: "add-food",
                element: <PrivateRoutes><AddFood></AddFood></PrivateRoutes>,
            },
            {
                path: "my-orders",
                element: <PrivateRoutes><MyOrders></MyOrders></PrivateRoutes>,
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
