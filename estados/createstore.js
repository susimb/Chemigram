import { useEffect, useState, useCallback } from "react";
export function createStore({
  initialValue,
  getFromStorage, 
  setToStorage,   
  select,         
  merge,         
}) {
  return function useSliceStore() {
    const [slice, setSlice] = useState(() => select(getFromStorage()));

    useEffect(() => {
      setSlice(select(getFromStorage()));

    }, []);

    const patch = useCallback((patchObj) => {
      const stored = getFromStorage();
      const oldSlice = select(stored);
      const nextSlice = merge(oldSlice, patchObj);

      const nextStored = { ...stored, ...updateSliceInStored(stored, nextSlice) };
    
      setToStorage(nextStored);
      setSlice(nextSlice);
    }, []);

    return { slice, setSlice, patch };
  };
}
function updateSliceInStored(_storedState, _nextSlice) {
  return {};
}