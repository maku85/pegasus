interface CertificationBadgeProps {
  certification: string;
}

export default function CertificationBadge({
  certification,
}: CertificationBadgeProps) {
  if (!certification) return null;

  let colorClass = "bg-black/70 border-gray-500/40 text-gray-300";

  // Color logic based on Italian ratings (approximate)
  if (certification === "T" || certification === "PT") {
    colorClass = "bg-black/70 border-green-500/40 text-green-400";
  } else if (certification === "BA" || certification === "6+") {
    colorClass = "bg-black/70 border-blue-500/40 text-blue-400";
  } else if (certification === "VM14" || certification === "14+") {
    colorClass = "bg-black/70 border-orange-500/40 text-orange-400";
  } else if (certification === "VM18" || certification === "18+") {
    colorClass = "bg-black/70 border-red-500/40 text-red-400";
  }

  return (
    <span
      className={`px-3 py-1 rounded border text-sm font-bold ${colorClass}`}
    >
      {certification}
    </span>
  );
}
