import React from 'react';

export const GenericError = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg">
      <h1 className="font-headings text-5xl font-bold text-[#B56A45] mb-2">Error</h1>
      <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
      <p className="text-[#676767] text-sm max-w-md mb-6">An unexpected execution error has halted the administration panel module. Please retry the operation.</p>
      {error && (
        <pre className="bg-[#FCFBF8] border border-[#ECE7DF] p-3 rounded-lg text-left text-[10px] font-mono text-[#B56A45] overflow-auto max-w-lg w-full max-h-32 mb-6 scrollbar-thin">
          {error.message || error.toString()}
        </pre>
      )}
      <button 
        onClick={resetErrorBoundary || (() => window.location.reload())}
        className="bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors"
      >
        Retry Transaction
      </button>
    </div>
  );
};

export default GenericError;
