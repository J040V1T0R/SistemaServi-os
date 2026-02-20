import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Tipos de Usuário
export type UserRole = "TECH";

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  switchUser: (userId: string) => void;
  usersList: User[];
}

const DEFAULT_USER: User | null = null;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [techUsers, setTechUsers] = useState<User[]>([]);

  const usersList = useMemo(() => [...techUsers], [techUsers]);

  useEffect(() => {
    let isActive = true;
    import('../api').then(({ getTechnicians }) => {
      getTechnicians()
        .then((rows: any[]) => {
          if (!isActive) return;
          const mapped = (rows || []).map((t) => {
            const initials = String(t.name || '')
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((p: string) => p[0])
              .join('')
              .toUpperCase();
            return {
              id: String(t.id),
              name: String(t.name),
              role: "TECH" as const,
              avatar: initials || "TE",
            };
          });
          setTechUsers(mapped);
        })
        .catch(() => {
          if (!isActive) return;
          setTechUsers([]);
        });
    });
    return () => {
      isActive = false;
    };
  }, []);

  const switchUser = (userId: string) => {
    const found = usersList.find(u => u.id === userId);
    if (found) setUser(found);
  };

  useEffect(() => {
    if (user && !usersList.find(u => u.id === user.id)) {
      setUser(null);
    }
  }, [usersList, user]);

  return (
    <AuthContext.Provider value={{ user, switchUser, usersList }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);