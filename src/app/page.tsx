import HeroSection from "@/components/HeroSection";
import InstagramPostHero from "@/components/home/InstagramPostHero";
import HiringPopup from "@/components/home/HiringPopup";

const hiringActive =
  process.env.HIRING_ACTIVE === "1" || process.env.HIRING_ACTIVE === "true";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HiringPopup active={hiringActive} />
      <HeroSection />
      {/*instagram posts */}
      { <InstagramPostHero /> }
    </div>
  );
}