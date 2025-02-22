import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../../Providers/AuthProvider";

const Signin = () => {
    const { googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            if (!result || !result.user) {
                throw new Error("User authentication failed");
            }

            Swal.fire({
                title: "Success!",
                text: `Welcome, ${result.user.displayName || "User"}!`,
                icon: "success",
                confirmButtonText: "Go to Dashboard",
            }).then(() => {
                navigate("/");
            });
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.message || "Something went wrong",
                icon: "error",
                confirmButtonText: "Try Again",
            });
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="flex justify-center items-center gap-1 text-2xl text-black font-semibold mb-4">
                    Welcome to 
                    <h1 className="text-2xl font-bold">
                        Task<span className="text-purple-700">Flow</span>
                    </h1>
                </h2>
                <p className="pb-4">Smooth and seamless task management</p>
                <button
                    onClick={handleGoogleSignIn}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Signin;
