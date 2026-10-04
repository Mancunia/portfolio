import { fetchPortfolioData } from "@/lib/portfolio-server";
import { Portfolio } from "@/components/Portfolio";
import { FALLBACK_DATA } from "@/lib/site.config";
import type { PortfolioData } from "@/lib/types";

// Revalidate every 60 seconds so content stays fresh without a full rebuild
export const revalidate = 60;

export default async function HomePage() {
  let data: PortfolioData;

  try {
    data = await fetchPortfolioData();
  } catch {
    // Database not configured yet — serve fallback so the app renders
    data = FALLBACK_DATA;
  }

  return <Portfolio initialData={data} />;
}
