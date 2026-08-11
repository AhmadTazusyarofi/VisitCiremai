import type { JSX, ReactNode } from 'react';

export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`.trim()}>
      {children}
    </div>
  );
}
