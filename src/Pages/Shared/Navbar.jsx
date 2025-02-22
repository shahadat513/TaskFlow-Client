import { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProvider";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If user is not logged in, redirect to sign-in page
        if (!user && location.pathname !== "/signin") {
            navigate("/signin");
        } else if (user && location.pathname === "/signin") {
            navigate("/"); // Redirect logged-in users to home
        }
    }, [user, navigate, location]);

    const handleLogout = async () => {
        try {
            await logOut();
            Swal.fire({
                title: "Logged Out!",
                text: "You have successfully logged out.",
                icon: "success",
                confirmButtonText: "OK"
            }).then(() => {
                navigate("/signin");
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error",
                confirmButtonText: "Try Again"
            });
        }
    };

    return (
        <div className="navbar bg-pink-800">
            <div className="flex-1">
                <a className="btn text-white btn-ghost text-xl">TaskFlow</a>
            </div>
            <div className="flex-none gap-2">
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="User Avatar"
                                    src={user.photoURL || "https://via.placeholder.com/40"}
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <button onClick={handleLogout} className="btn btn-error w-full">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate("/signin")}
                        className="btn bg-white text-pink-800 hover:bg-gray-200"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
