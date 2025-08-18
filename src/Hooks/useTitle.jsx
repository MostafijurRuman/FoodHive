import { useEffect } from 'react';

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    
    // Cleanup function to restore previous title
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default useTitle;
