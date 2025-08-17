import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import Home from "../Pages/Home";
import HomeLayout from "../Layouts/HomeLayout";
import ErrorPage from "../Pages/ErrorPage";

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
                path: "contact",
                element: <div>Contact</div>,
            },
        ],
    },
]);

export default function Router() {
    return <RouterProvider router={router} />;
}
