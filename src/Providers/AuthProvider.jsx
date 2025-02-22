import { createContext, useEffect, useState } from "react";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { app } from "../firebase/firebase.init";

// Create Auth Context
export const AuthContext = createContext(null);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Persist user authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    // Google Sign-In
    const googleSignIn = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            if (!result || !result.user) {
                throw new Error("User authentication failed");
            }

            const userData = {
                name: result.user.displayName || "No Name",
                email: result.user.email,
                photoURL: result.user.photoURL || "https://via.placeholder.com/150"
            };

            setUser(result.user);

            // Store user in backend
            await fetch("https://task-flow-server-lyart.vercel.app/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            return result; // ✅ Ensure function returns the result

        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
            throw error; // ✅ Ensure error is caught in Signin.jsx
        } finally {
            setLoading(false);
        }
    };

    // Logout Function
    const logOut = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Update User Profile
    const updateUserProfile = async (name, photo) => {
        if (auth.currentUser) {
            try {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                    photoURL: photo
                });
                setUser({ ...auth.currentUser });
            } catch (error) {
                console.error("Profile Update Error:", error.message);
            }
        }
    };

    const userInfo = {
        user,
        loading,
        googleSignIn,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
