import type { Request, Response } from "express";

import { HeroModel } from "../models/Hero.js";
import { AboutModel } from "../models/About.js";
import { SkillModel } from "../models/Skill.js";
import { SkillsSectionModel } from "../models/SkillsSection.js";
import { ProjectModel } from "../models/Project.js";
import { ProjectsSectionModel } from "../models/ProjectsSection.js";
import { JourneyModel } from "../models/Journey.js";
import { TimelineSectionModel } from "../models/TimelineSection.js";
import { ConnectModel } from "../models/Connect.js";
import { isDbConnected } from "../config/db.js";

import {
  INITIAL_HERO,
  INITIAL_ABOUT,
  INITIAL_SKILLS,
  INITIAL_SKILLS_SECTION,
  INITIAL_PROJECTS,
  INITIAL_PROJECTS_SECTION,
  INITIAL_JOURNEY,
  INITIAL_TIMELINE_SECTION,
  INITIAL_CONNECT,
} from "../utils/seedData.js";

type PortfolioMemoryState = {
  hero: typeof INITIAL_HERO;
  about: typeof INITIAL_ABOUT;
  skills: typeof INITIAL_SKILLS;
  skillsSection: typeof INITIAL_SKILLS_SECTION;
  projects: typeof INITIAL_PROJECTS;
  projectsSection: typeof INITIAL_PROJECTS_SECTION;
  journey: typeof INITIAL_JOURNEY;
  timelineSection: typeof INITIAL_TIMELINE_SECTION;
  connect: typeof INITIAL_CONNECT;
};

const memoryState: PortfolioMemoryState = {
  hero: { ...INITIAL_HERO },
  about: { ...INITIAL_ABOUT },
  skills: [...INITIAL_SKILLS],
  skillsSection: { ...INITIAL_SKILLS_SECTION },
  projects: [...INITIAL_PROJECTS],
  projectsSection: { ...INITIAL_PROJECTS_SECTION },
  journey: [...INITIAL_JOURNEY],
  timelineSection: { ...INITIAL_TIMELINE_SECTION },
  connect: { ...INITIAL_CONNECT },
};

export async function getPortfolioData(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    if (isDbConnected()) {
      const [
        hero,
        about,
        skills,
        skillsSection,
        projects,
        projectsSection,
        journey,
        timelineSection,
        connect,
      ] = await Promise.all([
        HeroModel.findOne().lean(),
        AboutModel.findOne().lean(),
        SkillModel.find().sort({ order: 1 }).lean(),
        SkillsSectionModel.findOne().lean(),
        ProjectModel.find({ published: true }).sort({ order: 1 }).lean(),
        ProjectsSectionModel.findOne().lean(),
        JourneyModel.find({ published: true }).sort({ order: 1 }).lean(),
        TimelineSectionModel.findOne().lean(),
        ConnectModel.findOne().lean(),
      ]);

      // Build a complete snapshot only after every database query succeeds.
      const latestSnapshot: PortfolioMemoryState = {
        hero: (hero ?? memoryState.hero) as PortfolioMemoryState["hero"],
        about: (about ?? memoryState.about) as PortfolioMemoryState["about"],
        skills: skills as PortfolioMemoryState["skills"],
        skillsSection: (skillsSection ??
          memoryState.skillsSection) as PortfolioMemoryState["skillsSection"],
        projects: projects as PortfolioMemoryState["projects"],
        projectsSection: (projectsSection ??
          memoryState.projectsSection) as PortfolioMemoryState["projectsSection"],
        journey: journey as PortfolioMemoryState["journey"],
        timelineSection: (timelineSection ??
          memoryState.timelineSection) as PortfolioMemoryState["timelineSection"],
        connect: (connect ??
          memoryState.connect) as PortfolioMemoryState["connect"],
      };

      // Refresh the cache after a successful complete database read.
      Object.assign(memoryState, latestSnapshot);

      res.json({
        success: true,
        source: "mongodb",
        data: {
          personal: memoryState.hero,
          stats: memoryState.hero.stats,

          about: memoryState.about,
          aboutPillars: memoryState.about.pillars,
          aboutSection: memoryState.about,

          skills: memoryState.skills,
          skillsSection: memoryState.skillsSection,

          projects: memoryState.projects,
          projectsSection: memoryState.projectsSection,

          timeline: memoryState.journey,
          timelineSection: memoryState.timelineSection,

          connect: memoryState.connect,
          connectChannels: memoryState.connect.channels,
        },
      });

      return;
    }

    // MongoDB unavailable: serve the latest available in-memory snapshot.
    res.json({
      success: true,
      source: "memory_fallback",
      data: {
        personal: memoryState.hero,
        stats: memoryState.hero.stats,

        about: memoryState.about,
        aboutPillars: memoryState.about.pillars,
        aboutSection: memoryState.about,

        skills: memoryState.skills,
        skillsSection: memoryState.skillsSection,

        projects: memoryState.projects.filter((project) => project.published),
        projectsSection: memoryState.projectsSection,

        timeline: memoryState.journey.filter(
          (milestone) => milestone.published,
        ),
        timelineSection: memoryState.timelineSection,

        connect: memoryState.connect,
        connectChannels: memoryState.connect.channels,
      },
    });
  } catch (error: unknown) {
    console.error(
      "Error fetching portfolio data from MongoDB. Serving cached snapshot:",
      error,
    );

    // A database query failure must not destroy the last-known-good snapshot.
    res.json({
      success: true,
      source: "memory_fallback",
      warning:
        "Database temporarily unavailable. Serving cached portfolio data.",
      data: {
        personal: memoryState.hero,
        stats: memoryState.hero.stats,

        about: memoryState.about,
        aboutPillars: memoryState.about.pillars,
        aboutSection: memoryState.about,

        skills: memoryState.skills,
        skillsSection: memoryState.skillsSection,

        projects: memoryState.projects.filter((project) => project.published),
        projectsSection: memoryState.projectsSection,

        timeline: memoryState.journey.filter(
          (milestone) => milestone.published,
        ),
        timelineSection: memoryState.timelineSection,

        connect: memoryState.connect,
        connectChannels: memoryState.connect.channels,
      },
    });
  }
}

export function updateInMemoryState(
  section: keyof PortfolioMemoryState,
  data: unknown,
): void {
  (memoryState as unknown as Record<keyof PortfolioMemoryState, unknown>)[
    section
  ] = data;
}

export function getInMemoryState(): PortfolioMemoryState {
  return memoryState;
}
