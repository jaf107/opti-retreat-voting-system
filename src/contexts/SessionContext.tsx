import React, { createContext, ReactNode } from "react";
import useSession from "../hooks/useSession";

export type SessionContextType = ReturnType<typeof useSession>;

export const SessionContext = createContext<SessionContextType | null>(null);

type SessionProviderProps = {
  children: ReactNode;
  value: SessionContextType;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  value,
}) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
