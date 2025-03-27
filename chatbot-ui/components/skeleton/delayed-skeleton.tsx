import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'rounded-md',
        shouldShow && 'animate-pulse bg-primary/10',
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
