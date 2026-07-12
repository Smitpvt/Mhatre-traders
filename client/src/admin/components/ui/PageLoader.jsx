import React from 'react';

export const PageLoader = ({ message = 'Authenticating session...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FCFBF8]">
      <div className="w-12 h-12 border-2 border-[#ECE7DF] border-t-[#B56A45] rounded-full animate-spin"></div>
      <p className="mt-4 text-xs font-sans tracking-widest text-[#676767] uppercase animate-pulse">{message}</p>
    </div>
  );
};

export default PageLoader;
