import React, { createContext, useContext, useEffect, useState } from "react";
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

// ১. কনটেক্সট তৈরি
export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
const API = import.meta.env.VITE_SERVER_API || "http://localhost:5000";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const logOut = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setIsRoleLoading(true);
        try {
          const email = currentUser.email;

          // JWT টোকেন সেট করা
          await axios.post(
            `${API}/api/v1/auth/jwt`,
            { email },
            { withCredentials: true }
          );

          // ডাটাবেস থেকে রোল ও স্ট্যাটাস আনা
          const res = await axios.get(`${API}/api/v1/users/role/${email}`, {
            withCredentials: true,
          });

          setUserRole(res.data.role || "buyer");
          setUserStatus(res.data.status || "pending");
        } catch (error) {
          console.error("Role/JWT fetch failed:", error);
          setUserRole("buyer");
          setUserStatus("pending");
        } finally {
          setIsRoleLoading(false);
          setLoading(false);
        }
      } else {
        setUserRole(null);
        setUserStatus(null);
        setIsRoleLoading(false);
        setLoading(false);
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
