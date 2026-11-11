import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Layout,
  Cpu,
  Radio,
  Wrench,
  Zap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";

type Skill = {
  name: string;
  desc?: string;
  level?: string;
  highlight?: boolean;
};

type SkillCategory = {
  id: string;
  name: string;
  skills: Skill[];
};

type CardPosition = "active" | "previous" | "next";

export function SkillsSection() {
  const { data } = usePortfolio();

  const skills = (data?.skills ?? []) as SkillCategory[];
  const skillsSection = data?.skillsSection;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const categoryScrollerRef = useRef<HTMLDivElement>(null);
  const activeCategoryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const scroller = categoryScrollerRef.current;
    const activeButton = activeCategoryButtonRef.current;

    if (!scroller || !activeButton) return;

    const targetLeft =
      activeButton.offsetLeft -
      scroller.offsetLeft -
      (scroller.clientWidth - activeButton.clientWidth) / 2;

    scroller.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [selectedCategory]);

  const categoryIcons: Record<string, React.ElementType> = {
    embedded: Cpu,
    hardware: Zap,
    iot: Radio,
    fullstack: Layout,
    tools: Wrench,
    ai: Sparkles,
  };

  const categories = [
    { id: "all", label: "All Technologies" },
    ...skills.map((category) => ({
      id: category.id,
      label: category.name,
    })),
  ];

  const filteredCategories = useMemo(() => {
    return skills
      .filter(
        (category) =>
          selectedCategory === "all" || category.id === selectedCategory,
      )
      .map((category) => {
        if (!searchQuery.trim()) return category;

        const query = searchQuery.toLowerCase();

        return {
          ...category,
          skills: category.skills.filter((skill) =>
            skill.name.toLowerCase().includes(query),
          ),
        };
      })
      .filter((category) => category.skills.length > 0);
  }, [skills, selectedCategory, searchQuery]);

  const totalSkillsCount = useMemo(
    () => skills.reduce((total, category) => total + category.skills.length, 0),
    [skills],
  );

  const safeIndex =
    filteredCategories.length > 0 ? activeIndex % filteredCategories.length : 0;

  const previousIndex =
    filteredCategories.length > 1
      ? (safeIndex - 1 + filteredCategories.length) % filteredCategories.length
      : 0;

  const nextIndex =
    filteredCategories.length > 1
      ? (safeIndex + 1) % filteredCategories.length
      : 0;

  const goToSlide = (index: number) => {
    if (!filteredCategories.length) return;

    const length = filteredCategories.length;
    setActiveIndex((index + length) % length);
  };

  const nextSlide = () => goToSlide(safeIndex + 1);
  const previousSlide = () => goToSlide(safeIndex - 1);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveIndex(0);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setActiveIndex(0);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setActiveIndex(0);
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") previousSlide();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [safeIndex, filteredCategories.length]);

  // Carousel card
  const renderCard = (
    category: SkillCategory,
    position: CardPosition,
    index: number,
  ) => {
    const Icon = categoryIcons[category.id] || Layout;
    const isActive = position === "active";
    const isHardware = category.id === "hardware";

    return (
      <article
        key={`${category.id}-${position}`}
        className={`
          skills-carousel-card
          skills-card-${position}
          ${isActive ? "z-30" : "z-10"}
          group relative flex flex-col overflow-hidden
          rounded-2xl border backdrop-blur-2xl
          ${
            isActive
              ? "border-[var(--theme-accent-400)]"
              : "border-[var(--theme-border)]"
          }
        `}
        aria-hidden={!isActive}
        onClick={
          !isActive
            ? () =>
                goToSlide(position === "previous" ? previousIndex : nextIndex)
            : undefined
        }
      >
        {/* Card background */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -right-20 -top-24 h-64 w-64 rounded-full blur-[90px] ${
              isHardware ? "bg-cyan-500/15" : "bg-purple-500/20"
            }`}
          />

          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-fuchsia-600/10 blur-[90px]" />

          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-purple-500/[0.06]" />

          <div className="skills-card-grid absolute inset-0 opacity-25" />

          {isActive && <div className="skills-card-light absolute inset-0" />}
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[var(--theme-border)] px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                skills-category-icon flex h-9 w-9 shrink-0
                items-center justify-center rounded-xl border
                border-[var(--theme-border)]
                bg-[var(--theme-accent)]/10
                text-[var(--theme-accent-300)]
              "
            >
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[8px] tracking-[0.2em] text-[var(--theme-accent-300)]">
                ENGINEERING DOMAIN
              </p>

              <h3 className="mt-1 truncate font-serif-display text-base font-bold text-white">
                {category.name}
              </h3>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span className="font-mono text-[11px] text-[var(--theme-accent-200)]">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(filteredCategories.length).padStart(2, "0")}
            </span>

            {isActive && (
              <p className="mt-1 font-mono text-[8px] tracking-wider text-emerald-400">
                ● ACTIVE
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="relative z-10 flex-1 overflow-y-auto px-4 py-3 skills-card-content">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[9px] font-semibold tracking-[0.2em] text-[var(--theme-accent-300)]">
              SKILLS
            </span>

            <span className="font-mono text-[8px] text-slate-500">
              {String(category.skills.length).padStart(2, "0")} ITEMS
            </span>
          </div>

          <div>
            {category.skills.map((skill, skillIndex) => (
              <div
                key={`${skill.name}-${skillIndex}`}
                className={`skills-item ${
                  isActive ? "skills-item-reveal" : ""
                }`}
                style={
                  {
                    "--item-delay": `${skillIndex * 65}ms`,
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center gap-3 py-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-[var(--theme-border)] bg-[var(--theme-accent-500)]/10 text-[var(--theme-accent-300)]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>

                  <span className="text-xs font-semibold text-slate-100 transition-colors duration-300 hover:text-[var(--theme-accent-300)]">
                    {skill.name}
                  </span>

                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--theme-accent-400)]" />
                </div>

                <div className="ml-9 h-px bg-gradient-to-r from-purple-400/25 via-purple-500/10 to-transparent" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-[var(--theme-border)] bg-black/10 px-4 py-2.5">
          <span className="font-mono text-[8px] tracking-wider text-slate-500">
            ENGINEERING STACK
          </span>

          <span className="flex items-center gap-2 font-mono text-[8px] text-purple-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            VERIFIED SKILLS
          </span>
        </div>
      </article>
    );
  };

  return (
    <section
      id="skills"
      className="
        skills-cinematic relative scroll-mt-24 overflow-hidden
        bg-[var(--theme-bg-base)]
        pb-10 pt-20
        sm:scroll-mt-20 sm:py-14
      "
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-circuit-grid opacity-30" />

      <div className="skills-background-glow pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--theme-accent-500)]/10 blur-[130px]" />

      <div className="skills-particle-one pointer-events-none absolute left-[12%] top-[20%] h-1 w-1 rounded-full bg-purple-300 shadow-[0_0_18px_5px_rgba(168,85,247,0.5)]" />

      <div className="skills-particle-two pointer-events-none absolute right-[15%] top-[55%] h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_18px_5px_rgba(34,211,238,0.4)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-7 w-full max-w-7xl text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-purple-500/50" />

            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--theme-accent-400)]">
              {skillsSection?.kicker || "TECHNICAL ARSENAL"}
            </span>

            <span className="h-px w-10 bg-purple-500/50" />
          </div>

          <h2 className="whitespace-nowrap font-serif-display text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
            {skillsSection?.headline || "Engineering Competencies & Protocols"}
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            {skillsSection?.description ||
              "Proficiency spanning embedded firmware, electronics, communication protocols and modern software platforms."}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 font-mono text-[8px] tracking-wider text-slate-500">
            <span>
              <span className="text-emerald-400">●</span> SYSTEM ONLINE
            </span>

            <span>
              {String(totalSkillsCount).padStart(2, "0")} COMPETENCIES
            </span>

            <span>{skills.length} DOMAINS</span>
          </div>
        </div>

        {/* Category navigation and search */}
        <div className="mx-auto mb-6 w-full border-b border-purple-500/20 pb-4">
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            {/* Horizontally scrollable categories */}
            <div className="relative min-w-0 flex-1">
              <div
                ref={categoryScrollerRef}
                className="
                  skills-category-scroller flex w-full items-center gap-1.5
                  overflow-x-auto overscroll-x-contain touch-pan-x
                  rounded-xl border border-purple-500/25
                  bg-[var(--theme-bg-card)] p-1.5
                  scrollbar-none
                "
                role="tablist"
                aria-label="Filter skills by category"
              >
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      ref={isActive ? activeCategoryButtonRef : null}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`
                        shrink-0 whitespace-nowrap rounded-lg
                        px-3 py-2 text-[10px] font-medium
                        transition-all duration-300 sm:px-3.5 sm:text-[11px]
                        ${
                          isActive
                            ? "bg-[var(--theme-accent-500)] text-white"
                            : "text-slate-400 hover:bg-[var(--theme-accent-500)]/10 hover:text-[var(--theme-accent-300)]"
                        }
                      `}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>

              <div className="pointer-events-none absolute right-0 top-0 h-full w-8 rounded-r-xl bg-gradient-to-l from-[#160b28] to-transparent sm:hidden" />
            </div>

            {/* Search */}
            <div className="relative w-full shrink-0 lg:w-64 xl:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search ESP32, React, Python..."
                aria-label="Search skills"
                className="
                  w-full rounded-xl border border-[var(--theme-border)]
                  bg-[var(--theme-bg-card)] py-2.5 pl-10 pr-10
                  text-[11px] text-white outline-none transition-all
                  placeholder:text-slate-500
                  focus:border-[var(--theme-accent-400)]
                  focus:shadow-[0_0_18px_rgba(var(--theme-accent-rgb),0.2)]
                "
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel status */}
        <div className="mx-auto mb-3 flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[8px] tracking-widest text-slate-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--theme-accent-400)]" />
            MODULE NAVIGATION
          </div>

          <span className="font-mono text-[11px] text-purple-300">
            {filteredCategories.length
              ? `${String(safeIndex + 1).padStart(2, "0")} / ${String(
                  filteredCategories.length,
                ).padStart(2, "0")}`
              : "00 / 00"}
          </span>
        </div>

        {/* Carousel */}
        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-[var(--theme-border)] bg-[#160b28]/80 py-12 text-center">
            <Search className="mx-auto mb-3 h-7 w-7 text-purple-400" />

            <h3 className="text-base font-semibold text-white">
              No matching skills found
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Try another skill name or reset your filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-purple-500/30 px-4 py-2 text-xs text-purple-300 transition hover:bg-purple-500/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div
              className="skills-carousel-stage relative mx-auto h-[370px] w-full max-w-5xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "pan-y" }}
            >
              {/* Previous card */}
              {filteredCategories.length > 1 &&
                renderCard(
                  filteredCategories[previousIndex],
                  "previous",
                  previousIndex,
                )}

              {/* Next card */}
              {filteredCategories.length > 1 &&
                renderCard(filteredCategories[nextIndex], "next", nextIndex)}

              {/* Active card */}
              {renderCard(filteredCategories[safeIndex], "active", safeIndex)}

              {/* Left arrow */}
              {filteredCategories.length > 1 && (
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Previous skill category"
                  className="skills-arrow skills-arrow-left group"
                >
                  <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </button>
              )}

              {/* Right arrow */}
              {filteredCategories.length > 1 && (
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Next skill category"
                  className="skills-arrow skills-arrow-right group"
                >
                  <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-3 flex items-center justify-center gap-2">
              {filteredCategories.map((category, index) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to ${category.name}`}
                  aria-current={safeIndex === index ? "true" : undefined}
                  className={`
                    h-2 rounded-full transition-all duration-500
                    ${
                      safeIndex === index
                        ? "w-8 bg-[var(--theme-accent-400)]"
                        : "w-2 bg-slate-600 hover:bg-[var(--theme-accent-300)]"
                    }
                  `}
                />
              ))}
            </div>

            <div className="mt-3 text-center font-mono text-[8px] tracking-[0.2em] text-slate-600">
              USE ARROW KEYS OR SIDE CONTROLS TO EXPLORE
            </div>
          </>
        )}
      </div>

      {/* Carousel animations and layout */}
      <style>{`
        .skills-category-scroller {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .skills-category-scroller::-webkit-scrollbar {
          display: none;
        }

        .skills-carousel-stage {
          perspective: 1400px;
          transform-style: preserve-3d;
          isolation: isolate;
        }

        .skills-carousel-card {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(460px, 58%);
          height: 320px;
          transform-style: preserve-3d;
          transition:
            transform 750ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 650ms ease,
            filter 650ms ease,
            box-shadow 650ms ease;
          will-change: transform, opacity;
        }

        .skills-card-active {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          filter: brightness(1);
          pointer-events: auto;
        }

        .skills-card-previous {
          transform:
            translate(-50%, -50%)
            translateX(-76%)
            rotateY(10deg)
            scale(0.78);
          opacity: 0.65;
          filter: brightness(0.7);
          cursor: pointer;
        }

        .skills-card-next {
          transform:
            translate(-50%, -50%)
            translateX(76%)
            rotateY(-10deg)
            scale(0.78);
          opacity: 0.65;
          filter: brightness(0.7);
          cursor: pointer;
        }

        .skills-card-previous:hover,
        .skills-card-next:hover {
          opacity: 0.85;
          filter: brightness(0.9);
        }

        .skills-card-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(var(--theme-accent-rgb), 0.45) transparent;
        }

        .skills-card-content::-webkit-scrollbar {
          width: 4px;
        }

        .skills-card-content::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.45);
          border-radius: 10px;
        }

        .skills-card-grid {
          background-image:
            linear-gradient(rgba(192,132,252,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,132,252,0.035) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to bottom, black, transparent);
        }

        .skills-card-light {
          background: linear-gradient(
            115deg,
            transparent 20%,
            rgba(192,132,252,0.08) 45%,
            transparent 65%
          );
          background-size: 220% 100%;
          animation: skills-light-sweep 6s ease-in-out infinite;
        }

        .skills-category-icon {
          transition: transform 500ms ease, box-shadow 500ms ease;
        }

        .skills-card-active .skills-category-icon {
          animation: skills-icon-pulse 3s ease-in-out infinite;
        }

        .skills-item-reveal {
          animation: skills-item-enter 550ms both cubic-bezier(0.2,0.8,0.2,1);
          animation-delay: var(--item-delay, 0ms);
        }

        .skills-arrow {
          position: absolute;
          top: 50%;
          z-index: 50;
          display: flex;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(var(--theme-accent-rgb), 0.5);
          border-radius: 50%;
          background: var(--theme-bg-card);
          color: var(--theme-accent-300);
          box-shadow: 0 0 22px rgba(var(--theme-accent-rgb), 0.16);
          transform: translateY(-50%);
          transition: all 300ms ease;
        }

        .skills-arrow:hover {
          border-color: var(--theme-accent-400);
          background: var(--theme-accent-500);
          color: white;
          box-shadow: 0 0 28px rgba(var(--theme-accent-rgb), 0.5);
          transform: translateY(-50%) scale(1.1);
        }

        .skills-arrow-left {
          left: 1.5%;
        }

        .skills-arrow-right {
          right: 1.5%;
        }

        .skills-particle-one {
          animation: skills-float 7s ease-in-out infinite;
        }

        .skills-particle-two {
          animation: skills-float 9s ease-in-out infinite reverse;
        }

        .skills-background-glow {
          animation: skills-ambient 8s ease-in-out infinite alternate;
        }

        @keyframes skills-item-enter {
          from {
            opacity: 0;
            transform: translateY(14px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes skills-light-sweep {
          0%, 100% { background-position: 100% 0; }
          50% { background-position: -100% 0; }
        }

        @keyframes skills-icon-pulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(168,85,247,0.08);
          }
          50% {
            box-shadow:
              0 0 22px rgba(168,85,247,0.3),
              inset 0 0 12px rgba(168,85,247,0.1);
          }
        }

        @keyframes skills-float {
          0%, 100% {
            transform: translate3d(0,0,0);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(18px,-22px,0);
            opacity: 1;
          }
        }

        @keyframes skills-ambient {
          from {
            transform: translateX(-50%) scale(0.9);
            opacity: 0.5;
          }
          to {
            transform: translateX(-50%) scale(1.12);
            opacity: 1;
          }
        }

        @media (max-width: 1024px) {
          .skills-carousel-card {
            width: 58%;
          }

          .skills-card-previous {
            transform:
              translate(-50%, -50%)
              translateX(-78%)
              rotateY(8deg)
              scale(0.76);
          }

          .skills-card-next {
            transform:
              translate(-50%, -50%)
              translateX(78%)
              rotateY(-8deg)
              scale(0.76);
          }

          .skills-arrow-left {
            left: 0;
          }

          .skills-arrow-right {
            right: 0;
          }
        }

        @media (max-width: 768px) {
          .skills-carousel-stage {
            height: 350px;
            max-width: 620px;
          }

          .skills-carousel-card {
            width: min(410px, calc(100% - 76px));
            height: 310px;
          }

          .skills-card-previous {
            transform:
              translate(-50%, -50%)
              translateX(-45%)
              scale(0.82);
            opacity: 0;
            pointer-events: none;
          }

          .skills-card-next {
            transform:
              translate(-50%, -50%)
              translateX(45%)
              scale(0.82);
            opacity: 0;
            pointer-events: none;
          }

          .skills-arrow-left {
            left: 1%;
          }

          .skills-arrow-right {
            right: 1%;
          }

          .skills-arrow {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 480px) {
          .skills-carousel-stage {
            height: 340px;
            width: 100%;
          }

          .skills-carousel-card {
            width: calc(100% - 76px);
            max-width: 340px;
            height: 300px;
          }

          .skills-card-content {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .skills-arrow-left {
            left: 2px;
          }

          .skills-arrow-right {
            right: 2px;
          }

          .skills-arrow {
            width: 34px;
            height: 34px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .skills-carousel-card,
          .skills-item-reveal,
          .skills-category-icon,
          .skills-card-light,
          .skills-particle-one,
          .skills-particle-two,
          .skills-background-glow {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
