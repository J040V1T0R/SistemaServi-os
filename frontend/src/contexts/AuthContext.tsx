import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from "react";

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
  loadingTechs: boolean;
  techError: string | null;
  refreshTechnicians: () => void;
}

const DEFAULT_USER: User | null = null;

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [techUsers, setTechUsers] = useState<User[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(false);
  const [techError, setTechError] = useState<string | null>(null);

  const usersList = useMemo(() => [...techUsers], [techUsers]);

  const refreshTechnicians = useCallback(() => {
    let isActive = true;
    setLoadingTechs(true);
    setTechError(null);
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
          setLoadingTechs(false);
        })
        .catch((err: any) => {
          if (!isActive) return;
          setTechUsers([]);
          setLoadingTechs(false);
          setTechError(err?.message || 'Falha ao carregar tecnicos');
        });
    });
    // best-effort cancel for in-flight promise
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    refreshTechnicians();
  }, [refreshTechnicians]);

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
    <AuthContext.Provider value={{ user, switchUser, usersList, loadingTechs, techError, refreshTechnicians }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);