import { Outlet } from "react-router-dom";
import Navbar from "../Pages/Shared/Navbar";


const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            {/* <Footer></Footer> */}
        </div>
    );
}

export default MainLayout;
