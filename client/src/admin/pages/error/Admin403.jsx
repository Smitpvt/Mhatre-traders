import React from 'react';
import { Link } from 'react-router-dom';

export const Admin403 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="font-headings text-6xl font-bold text-[#B56A45] mb-2">403</h1>
      <h2 className="text-lg font-bold mb-2">Access Forbidden</h2>
      <p className="text-[#676767] text-sm max-w-sm mb-6">You do not possess the required permissions to view this resource. Contact a Super Admin for access levels.</p>
      <Link to="/admin" className="bg-[#B56A45] hover:bg-[#A05C39] text-[#FFFFFF] text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg transition-colors">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Admin403;
