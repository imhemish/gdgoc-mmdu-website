// app/about/page.tsx

import FluidAnimation from "@/components/custom/FluidAnimation";
import { TeamCarousel } from "@/components/custom/TeamCarousel";
import RounderBorderAbout from "@/components/custom/RounderBorderWapper";
import { IconBrandLinkedin } from "@tabler/icons-react";

// Server-side fetch
import { getTeamMembers } from "@/lib/getTeamMembers";

async function getTeamData() {
  const allMembers = await getTeamMembers();

  // Define a default faculty member object to use if no faculty is found
  const defaultFacultyMember = {
    name: "Dr. Vishal Gupta",
    title: process.env.FACULTY_ADVISOR_TITLE || "Faculty Advisor",
    bio: "Associate Professor at MMEC",
    tags: ["Information Retrieval", "Automata Theory"],
    avatar: "/images/vishalsir.jpeg", // Default avatar
    linkedin: "https://www.linkedin.com/in/sahara-vishal/", // Default LinkedIn
    is_faculty: true,
    is_lead: false,
  };

  let faculty =
    allMembers.find((member: any) => member.title === "Faculty Advisor") || defaultFacultyMember;

  const lead = allMembers.find((member: any) => member.is_lead) || null;

  const members = allMembers.filter(
    (member: any) => !member.is_faculty && !member.is_lead
  );

  return { faculty, lead, members };
}

export default async function About() {
  const { faculty, lead, members } = await getTeamData();

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#373737]">
      {/* Leadership Section */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* ================= FACULTY ================= */}
          <div className="flex flex-col items-center">
            <FluidAnimation
              path={faculty?.avatar || "/images/vishalsir.jpeg"}
            />

            <div className="mt-8 flex max-w-xl flex-col items-center text-center">
              <h1 className="mb-3 text-3xl font-bold text-transparent bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text sm:text-4xl lg:text-5xl">
                {faculty?.name || "Dr. Vishal Gupta"}
              </h1>

              <p className="text-sm text-white md:text-base">
                {process.env.FACULTY_ADVISOR_TITLE || "Faculty Advisor"}
              </p>

              {faculty?.bio && (
                <p className="mt-6 text-sm leading-relaxed text-white/80 md:text-base">
                  {faculty.bio}
                </p>
              )}

              {faculty?.tags?.length ? (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {faculty.tags.slice(0, 5).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80"
                    >
                      {tag.replace(/^[-_]+/, "")}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 flex justify-center">
                <a
                  href="https://www.linkedin.com/in/sahara-vishal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
                >
                  <IconBrandLinkedin size={16} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* ================= LEAD ================= */}
          <div className="flex flex-col items-center">
            <FluidAnimation
              path={lead?.avatar || "/images/colored-gdg.png"}
            />

            <div className="mt-8 flex max-w-xl flex-col items-center text-center">
              <h1 className="mb-3 text-3xl font-bold text-transparent bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text sm:text-4xl lg:text-5xl">
                {lead?.name || "Organizer"}
              </h1>

              <p className="text-sm text-white md:text-base">
                GDGoC Organizer
              </p>

              {lead?.bio && (
                <p className="mt-6 text-sm leading-relaxed text-white/80 md:text-base">
                  {lead.bio}
                </p>
              )}

              {lead?.tags?.length ? (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {lead.tags.slice(0, 5).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80"
                    >
                      {tag.replace(/^[-_]+/, "")}
                    </span>
                  ))}
                </div>
              ) : null}

              {lead?.linkedin && (
                <div className="mt-6 flex justify-center">
                  <a
                    href={lead.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
                  >
                    <IconBrandLinkedin size={16} />
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="px-5">
        <TeamCarousel members={members} />
      </section>

      <RounderBorderAbout />
    </div>
  );
}