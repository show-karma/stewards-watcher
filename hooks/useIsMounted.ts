import { useEffect, useState } from 'react';

export function useIsMounted<T>(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  return mounted;
}
