import { createContext, useContext, useState, type ReactNode } from "react";

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

// Lista de Usuários Fictícios para o Vídeo
const MOCK_USERS: User[] = [
  { id: "1", name: "Carlos (Gerente)", role: "MANAGER", avatar: "CN" },
  { id: "2", name: "João (Técnico)", role: "TECH", avatar: "JD" },
  { id: "3", name: "Ana (Técnica)", role: "TECH", avatar: "AL" },
];

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(MOCK_USERS[0]); // Começa como Gerente

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) setUser(found);
  };

  return (
    <AuthContext.Provider value={{ user, switchUser, usersList: MOCK_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);