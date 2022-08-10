import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// create a context to hold onto a reference to the portal container
export const NestedPortalRefContext = createContext<HTMLDivElement | null>(null);

// create a provider to return the portal container ref to the parent component
export const NestedPortalRefProvider = ({children}) => {
  const portalRef = useRef<HTMLDivElement | null>(null);
  return (
    <NestedPortalRefContext.Provider value={portalRef}>
      {children}
    </NestedPortalRefContext.Provider>
  );
}

export const useNestedPortalRef = () => useContext(NestedPortalRefContext);

export const NestedPortal = ({children}) => {
  const containerRef = useNestedPortalRef();
  console.log('containerRef', containerRef);

  // get the portal container ref from the parent component
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    // Force a rerender, so it can be passed to the child.
    // If this causes an unwanted flicker, use useLayoutEffect instead
    setElement(containerRef?.current);
  }, [containerRef]);

  if (element == null) {
    return null;
  }

  return createPortal(children, element);
}

