import { tmdbImage } from "@/lib/tmdb";

interface ProductionCompaniesProps {
    companies: {
        id: number;
        logo_path: string | null;
        name: string;
    }[];
}

export default function ProductionCompanies({ companies }: ProductionCompaniesProps) {
    if (!companies || companies.length === 0) return null;

    const companiesWithLogo = companies.filter((c) => c.logo_path);

    if (companiesWithLogo.length === 0) return null;

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-300 mb-4">Produzione</h3>
            <div className="flex flex-wrap items-center gap-8 bg-white/5 p-6 rounded-xl backdrop-blur-sm">
                {companiesWithLogo.map((company) => (
                    <div key={company.id} className="bg-white/10 p-2 rounded-lg h-16 flex items-center justify-center min-w-[100px]">
                        <img
                            src={tmdbImage(company.logo_path, "w200")}
                            alt={company.name}
                            className="max-h-full max-w-full object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
                            title={company.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
