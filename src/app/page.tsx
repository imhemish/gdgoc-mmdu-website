import HeroSection from "@/components/HeroSection";
import CommunityAlliesSection from "@/components/home/CommunityAllies";
import InstagramPostHero from "@/components/home/InstagramPostHero";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}

      <HeroSection />
      {/*other gdgs sections */}
      <CommunityAlliesSection />
      {/*instagram posts */}
      <InstagramPostHero />
    </div>
  );
}
