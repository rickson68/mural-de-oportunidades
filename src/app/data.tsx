import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { EventItem, Opportunity } from "./types";

type DataState = {
  opportunities: Opportunity[];
  events: EventItem[];
  loading: boolean;
  error: boolean;
  retry: () => void;
};

const DataContext = createContext<DataState | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    Promise.all([
      import("../data/oportunidades.json"),
      import("../data/eventos.json"),
    ])
      .then(([opportunityData, eventData]) => {
        if (!active) return;
        setOpportunities(opportunityData.default as Opportunity[]);
        setEvents(eventData.default as EventItem[]);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [attempt]);

  return (
    <DataContext.Provider
      value={{
        opportunities,
        events,
        loading,
        error,
        retry: () => setAttempt((value) => value + 1),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const data = useContext(DataContext);
  if (!data) throw new Error("UseData deve estar dentro do DataProvider.");
  return data;
}
