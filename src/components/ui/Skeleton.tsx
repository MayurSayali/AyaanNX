import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/40 p-3 animate-pulse">
      <div className="w-full aspect-[4/3] bg-neutral-200 dark:bg-neutral-800 mb-3" />
      <div className="h-3 w-1/3 bg-neutral-200 dark:bg-neutral-800 mb-2" />
      <div className="h-4 w-3/4 bg-neutral-300 dark:bg-neutral-700 mb-3" />
      <div className="h-4 w-1/4 bg-neutral-200 dark:bg-neutral-800 mt-auto" />
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-neutral-100 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-800 animate-pulse"
        />
      ))}
    </div>
  );
};
