import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

// Tipos de Usuário
export type UserRole = "MANAGER" | "TECH";

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

interface AuthContextType {
  user: User;
  switchUser: (userId: string) => void;
  usersList: User[];
}

const MANAGER_USER: User = { id: "manager-carlos", name: "Carlos (Gerente)", role: "MANAGER", avatar: "CN" };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(MANAGER_USER); // Começa como Gerente
  const [techUsers, setTechUsers] = useState<User[]>([]);

  const usersList = useMemo(() => [MANAGER_USER, ...techUsers], [techUsers]);

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
    if (!usersList.find(u => u.id === user.id)) {
      setUser(MANAGER_USER);
    }
  }, [usersList, user.id]);

  return (
    <AuthContext.Provider value={{ user, switchUser, usersList }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);