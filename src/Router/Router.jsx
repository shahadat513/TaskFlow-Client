import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Signin from "../Pages/Signin/Signin";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout> ,
        errorElement: <h2>Error Page</h2>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/signin",
                element: <Signin></Signin>
            },

        ]
    },
  ]);