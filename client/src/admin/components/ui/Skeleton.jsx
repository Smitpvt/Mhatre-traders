import React from 'react';

export const Skeleton = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`animate-pulse bg-[#ECE7DF] rounded ${className}`} />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-[#FFFFFF] border border-[#ECE7DF] rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center pb-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="space-y-3">
        <div className="flex space-x-4 py-2">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-5 flex-1" />
          ))}
        </div>
        <div className="border-b border-[#ECE7DF]" />
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="flex space-x-4 py-1">
            {Array.from({ length: cols }).map((_, cIndex) => (
              <Skeleton key={cIndex} className="h-8 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
