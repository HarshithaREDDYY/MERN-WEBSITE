import React from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
