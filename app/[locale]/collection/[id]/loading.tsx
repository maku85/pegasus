import CardGridSkeleton from "@/components/skeletons/CardGridSkeleton";
import PosterPageSkeleton from "@/components/skeletons/PosterPageSkeleton";

export default function Loading() {
  return (
    <PosterPageSkeleton>
      <CardGridSkeleton count={5} />
    </PosterPageSkeleton>
  );
}
