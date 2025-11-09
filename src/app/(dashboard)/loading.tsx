import { PageHeaderSkeleton, GridSkeleton, ChartSkeleton, CardListSkeleton } from '@/components/loading-skeletons';

export default function Loading() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeaderSkeleton />
      <GridSkeleton cols={4} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartSkeleton />
        <CardListSkeleton count={3} />
      </div>
    </div>
  );
}

