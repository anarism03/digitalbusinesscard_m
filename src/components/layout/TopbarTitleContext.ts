import { createContext, useContext, useEffect } from "react";
import type { SetTopbarTitle } from "../../types/components/layout";

const TopbarTitleContext = createContext<SetTopbarTitle | null>(null);

export const TopbarTitleProvider = TopbarTitleContext.Provider;

export function useTopbarTitle(title: string | undefined): boolean {
  const setTopbarTitle = useContext(TopbarTitleContext);

  useEffect(() => {
    setTopbarTitle?.(title);
    return () => setTopbarTitle?.(undefined);
  }, [setTopbarTitle, title]);

  return setTopbarTitle !== null;
}
