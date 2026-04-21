import { createContext, useContext, useState, ReactNode } from "react";

export type WelcomeState = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export const WELCOME_STATE_LABELS: Record<WelcomeState, string> = {
  1: "Docs incomplete",
  2: "Awaiting forms",
  3: "Forms ready",
  4: "Tracking",
  5: "Track + docs",
  6: "Track + sign",
  7: "Track + both",
  8: "Completed",
};

interface WelcomeStateContextType {
  welcomeState: WelcomeState;
  setWelcomeState: (s: WelcomeState) => void;
  showDocsDot: boolean;
  showSignDot: boolean;
}

const WelcomeStateContext = createContext<WelcomeStateContextType>({
  welcomeState: 1,
  setWelcomeState: () => {},
  showDocsDot: false,
  showSignDot: false,
});

const DOC_DOT_STATES: WelcomeState[] = [1, 5, 7];
const SIGN_DOT_STATES: WelcomeState[] = [3, 6, 7];

export const WelcomeStateProvider = ({ children }: { children: ReactNode }) => {
  const [welcomeState, setWelcomeState] = useState<WelcomeState>(1);

  return (
    <WelcomeStateContext.Provider
      value={{
        welcomeState,
        setWelcomeState,
        showDocsDot: DOC_DOT_STATES.includes(welcomeState),
        showSignDot: SIGN_DOT_STATES.includes(welcomeState),
      }}
    >
      {children}
    </WelcomeStateContext.Provider>
  );
};

export const useWelcomeState = () => useContext(WelcomeStateContext);
