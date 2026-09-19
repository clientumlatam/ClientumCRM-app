import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Company, Opportunity, Person, Task, Activity } from '../types';

interface CRMDataContextType {
  opportunities: Opportunity[];
  companies: Company[];
  people: Person[];
  tasks: Task[];
  activities: Activity[];
  setOpportunities: React.Dispatch<React.SetStateAction<Opportunity[]>>;
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  updateEntity: <T>(collectionName: string, id: string, data: Partial<T>) => Promise<void>;
}

export const CRMDataContext = createContext<CRMDataContextType | undefined>(undefined);

export const CRMDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const updateEntity = useCallback(async <T,>(collectionName: string, id: string, data: Partial<T>) => {
    // This helper implements the granular setDoc with { merge: true }
    // It should be integrated with firebase functionality.
    console.log(`Granular update for ${collectionName}/${id}`, data);
    // await setDoc(doc(db, collectionName, id), data, { merge: true });
  }, []);

  return (
    <CRMDataContext.Provider value={{
      opportunities, setOpportunities,
      companies, setCompanies,
      people, setPeople,
      tasks, setTasks,
      activities, setActivities,
      updateEntity
    }}>
      {children}
    </CRMDataContext.Provider>
  );
};

export const useCRMData = () => {
  const context = useContext(CRMDataContext);
  if (!context) throw new Error('useCRMData must be used within a CRMDataProvider');
  return context;
};
