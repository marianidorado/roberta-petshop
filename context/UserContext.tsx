"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { getCurrentUserRole } from "@/lib/auth/getCurrentUserRole";

interface IUserContext {
  user: User | null;
  role: string | null;
  active: boolean;
  loading: boolean;
}

const UserContext = createContext<IUserContext>({
  user: null,
  role: null,
  active: false,
  loading: true
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userData = await getCurrentUserRole(firebaseUser.uid);

        if (userData) {
          setRole(userData.role);
          setActive(userData.active);
           if (!userData.active) {
              await auth.signOut();
            }
        }
      } else {
        setUser(null);
        setRole(null);
        setActive(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, active, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);