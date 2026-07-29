import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import type { TeamMember } from "@/types/team";

interface TeamCarouselProps {
  members: TeamMember[];
}

export function TeamCarousel({ members }: TeamCarouselProps) {
  if (members.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-10 text-muted-foreground">
        No team members found.
      </div>
    );
  }

  return <AnimatedTestimonials testimonials={members} autoplay={true} />;
}