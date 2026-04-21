import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

// Membuat konteks untuk autentikasi
const AuthContext = createContext();

// Provider = Komponen yang menyediakan nilai konteks ke seluruh aplikasi
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase otomatis cek apakah user sudah pernah login sebelumnya
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Bersihkan listener saat komponen unmount
    return unsubscribe;
  }, []);

  // Fungsi untuk mendaftar user baru
  async function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Fungsi masuk dengan akun yang sudah terdaftar
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Fungsi keluar dari akun yang sedang aktif
  async function logout() {
    return signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk menggunakan konteks autentikasi dengan lebih mudah
export function useAuth() {
  return useContext(AuthContext);
}
