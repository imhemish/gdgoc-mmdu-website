import HeroSection from "@/components/HeroSection";
import InstagramPostHero from "@/components/home/InstagramPostHero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/*instagram posts */}
      { <InstagramPostHero /> }
    </div>
  );
}
