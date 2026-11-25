import LoadingStatus from "@/components/skeletons/LoadingStatus";

export default function Loading() {
  return (
    <LoadingStatus>
      <div className="min-h-[70vh] bg-[#141414] flex items-center justify-center p-4">
        <div className="w-full max-w-md h-[370px] rounded-3xl bg-white/5" />
      </div>
    </LoadingStatus>
  );
}
