import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export const loginExecutivo = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  } catch (error) {
    console.error("Erro ao acessar o sistema:", error);
    throw error;
  }
};

export const logoutExecutivo = () => signOut(auth);