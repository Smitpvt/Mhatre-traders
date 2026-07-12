import React from 'react';
import { Link } from 'react-router-dom';

export const Admin404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="font-headings text-6xl font-bold text-[#B56A45] mb-2">404</h1>
      <h2 className="text-lg font-bold mb-2">Module Not Found</h2>
      <p className="text-[#676767] text-sm max-w-sm mb-6">The requested administration panel view could not be resolved. It may be under development.</p>
      <Link to="/admin" className="bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Admin404;
