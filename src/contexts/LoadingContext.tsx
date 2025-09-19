import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import LoadingScreen from "../components/templates/LoadingScreen";

interface LoadingContextType {
  isLoading: boolean;
  showLoading: (title?: string, subtitle?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState<string>();
  const [loadingSubtitle, setLoadingSubtitle] = useState<string>();

  const showLoading = (title?: string, subtitle?: string) => {
    setLoadingTitle(title);
    setLoadingSubtitle(subtitle);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingTitle(undefined);
    setLoadingSubtitle(undefined);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
      {isLoading && (
        <LoadingScreen title={loadingTitle} subtitle={loadingSubtitle} />
      )}
    </LoadingContext.Provider>
  );
};
