import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getCurrentUserRole = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.log("No existe documento del usuario");
      return null;
    }

    return userSnap.data();
  } catch (error) {
    console.error("Error obteniendo rol:", error);
    return null;
  }
};