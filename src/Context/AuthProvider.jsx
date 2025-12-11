import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.config";
import axios from "axios";

// AuthContext তৈরি করা
export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

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

  const updateUserProfile = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = () => {
    setLoading(true);

    return axios
      .post(
        `${import.meta.env.VITE_SERVER_API}/api/v1/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setUserRole(null);
        setUserStatus(null);
        setIsRoleLoading(false);
        return signOut(auth);
      })
      .catch((error) => {
        console.error(
          "Error during logout process, forcing Firebase sign out:",
          error
        );

        setUserRole(null);
        setUserStatus(null);
        setIsRoleLoading(false);
        return signOut(auth);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setLoading(true);
      setIsRoleLoading(true);
      setUserRole(null);
      setUserStatus(null);

      if (currentUser) {
        const email = currentUser.email;

        axios
          .post(
            `${import.meta.env.VITE_SERVER_API}/api/v1/auth/jwt`,
            { email },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            console.log("JWT Token set successfully.");

            return axios.get(
              `${import.meta.env.VITE_SERVER_API}/api/v1/users/role/${email}`
            );
          })
          .then((roleRes) => {
            const { role, status } = roleRes.data;
            setUserRole(role);
            setUserStatus(status);

            setIsRoleLoading(false);
            setLoading(false);
          })
          .catch((error) => {
            console.error(
              "Authentication chain failed (JWT or Role fetch):",
              error
            );

            signOut(auth).then(() => {
              setLoading(false);
              setIsRoleLoading(false);
            });
          });
      } else {
        setLoading(false);
        setIsRoleLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    createUser,
    updateUserProfile,
    signIn,
    signInWithGoogle,
    resetPassword,
    logOut,
    user,
    loading,
    userRole,
    userStatus,
    isRoleLoading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
