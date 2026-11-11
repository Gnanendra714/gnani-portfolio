import React from "react";
import { GraduationCap, Cpu, Code2 } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

const defaultPillars = [
  {
    title: "Academic Foundation",
    subtitle: "B.Tech in Electronics & Communication Engineering",
    description:
      "Building a foundation in electronics, circuit design, microprocessors and communication systems.",
  },
  {
    title: "Hardware Focus",
    subtitle: "ESP32 & Microcontroller Prototyping",
    description:
      "Developing embedded applications using microcontrollers, Embedded C, sensor interfacing and communication protocols.",
  },
  {
    title: "Software Focus",
    subtitle: "Full-Stack Development",
    description:
      "Building responsive web applications, backend services, REST APIs and database-driven applications.",
  },
];

const cardStyles = [{ icon: GraduationCap }, { icon: Cpu }, { icon: Code2 }];

export function AboutSection() {
  const { data } = usePortfolio();

  const about: any = (data as any)?.aboutSection || (data as any)?.about || {};

  const personal = data?.personal;

  const pillars = defaultPillars.map((fallback, index) => {
    const adminPillar = about.pillars?.[index] || {};

    return {
      ...fallback,
      subtitle: adminPillar.subtitle || fallback.subtitle,
      description: adminPillar.description || fallback.description,
    };
  });

  const introduction =
    about.intro ||
    personal?.extendedBio ||
    "I'm Gnani, a B.Tech Electronics and Communication Engineering student interested in Embedded Systems, IoT, AI and Full-Stack Development.";

  return (
    <section
      id="about"
      className="
        relative w-full
        min-h-[calc(100svh-80px)]
        overflow-visible
        bg-[var(--theme-bg-surface)]/70
        lg:h-[calc(100svh-80px)]
        lg:min-h-0
        lg:overflow-hidden
      "
    >
      {/* Background effects */}
      <div
        className="
          pointer-events-none absolute bottom-10 left-10
          h-64 w-64 rounded-full
          opacity-10 blur-[100px]
        "
        style={{
          backgroundColor: "rgb(var(--theme-accent-rgb))",
        }}
      />

      {/* Main container */}
      <div
        className="
          relative z-10 mx-auto flex w-full max-w-6xl flex-col
          px-5 py-8
          lg:h-full lg:justify-center lg:px-6 lg:py-4
        "
      >
        {/* Introduction */}
        <div className="mx-auto mb-6 w-full max-w-3xl text-center lg:mb-5">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--theme-accent)] sm:text-[10px]">
            {about.kicker || "ABOUT ME"}
          </span>

          <h2
            className="
              mb-2 mt-2
              font-serif-display font-bold
              text-[var(--theme-text-primary)]
              text-2xl sm:text-3xl lg:text-3xl
            "
          >
            {about.headline || "Bridging Low-Level Silicon & High-Level Cloud"}
          </h2>

          <p className="mx-auto max-w-3xl text-xs leading-relaxed text-[var(--theme-text-secondary)] sm:text-sm">
            {introduction}
          </p>
        </div>

        {/* Three cards - original layout preserved */}
        <div
          className="
            grid w-full grid-cols-1 gap-4
            md:grid-cols-2
            lg:grid-cols-3 lg:gap-4
          "
        >
          {pillars.map((pillar, index) => {
            const style = cardStyles[index];
            const Icon = style.icon;

            return (
              <article
                key={pillar.title}
                className="
                  group flex min-w-0 flex-col items-center
                  rounded-2xl border
                  border-[var(--theme-border)]
                  bg-[var(--theme-bg-card)]/80
                  p-4 text-center
                  shadow-xl backdrop-blur-md
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:border-[var(--theme-accent)]
                  min-h-[220px]
                  lg:h-[250px] lg:min-h-0
                "
              >
                {/* Icon */}
                <div
                  className="
                    mb-2.5 flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl border
                    border-[var(--theme-border)]
                    bg-[var(--theme-accent)]/10
                    text-[var(--theme-accent)]
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Heading */}
                <h3 className="mb-2 w-full font-serif-display text-base font-bold leading-snug text-[var(--theme-text-primary)] sm:text-lg">
                  {pillar.subtitle}
                </h3>

                {/* Description */}
                <p className="w-full text-center text-xs leading-relaxed text-[var(--theme-text-secondary)]">
                  {pillar.description}
                </p>

                {/* Footer */}
                <div className="mt-auto w-full border-t border-[var(--theme-border)] pt-2.5">
                  <span className="font-mono text-[9px] text-[var(--theme-accent)]">
                    {pillar.title}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
