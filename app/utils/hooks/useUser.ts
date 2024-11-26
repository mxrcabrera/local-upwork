import { useEffect, useState } from 'react';

import { onAuthStateChanged } from '../../libs/firebase/auth';


export function useUser(InitSession: string | null) {
  const [userUid, setUser] = useState<any | null>(InitSession);

  // Listen for changes to the user session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return userUid;
}