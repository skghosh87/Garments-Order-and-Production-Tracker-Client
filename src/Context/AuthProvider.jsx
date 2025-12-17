import React, { createContext, useEffect, useState, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();
const API = import.meta.env.VITE_SERVER_API;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  // ================= Auth Functions =================
  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

  const updateUserProfile = (name, photo) =>
    updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logOut = async () => {
    try {
      await axios.post(
        `${API}/api/v1/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      setUser(null);
      setUserRole(null);
      setUserStatus(null);
      await signOut(auth);
    }
  };

  // ================= Auth Observer =================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);
      setIsRoleLoading(true);

      if (!currentUser) {
        setLoading(false);
        setIsRoleLoading(false);
        return;
      }

      try {
        const email = currentUser.email;

        // 1️⃣ JWT
        await axios.post(
          `${API}/api/v1/auth/jwt`,
          { email },
          { withCredentials: true }
        );

        // 2️⃣ Role
        const res = await axios.get(`${API}/api/v1/users/role/${email}`, {
          withCredentials: true,
        });

        setUserRole(res.data.role);
        setUserStatus(res.data.status);
      } catch (error) {
        console.error("JWT / Role fetch failed:", error);

        // ❌ Firebase logout করবো না
        setUserRole("buyer");
        setUserStatus("active");
      } finally {
        setLoading(false);
        setIsRoleLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    userRole,
    userStatus,
    isRoleLoading,
    createUser,
    signIn,
    signInWithGoogle,
    resetPassword,
    updateUserProfile,
    logOut,
    setLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
