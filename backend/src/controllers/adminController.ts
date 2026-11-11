import type { Request, Response } from "express";

import { HeroModel } from "../models/Hero.js";
import { AboutModel } from "../models/About.js";
import { SkillModel } from "../models/Skill.js";
import { ProjectModel } from "../models/Project.js";
import { JourneyModel } from "../models/Journey.js";
import { ConnectModel } from "../models/Connect.js";
import { VisitorModel } from "../models/Visitor.js";
import { MessageModel } from "../models/Message.js";

import { SkillsSectionModel } from "../models/SkillsSection.js";
import { ProjectsSectionModel } from "../models/ProjectsSection.js";
import { TimelineSectionModel } from "../models/TimelineSection.js";

import { isDbConnected } from "../config/db.js";
import {
  updateInMemoryState,
  getInMemoryState,
} from "./portfolioController.js";

const DEFAULT_SKILLS_SECTION = {
  kicker: "TECHNICAL ARSENAL",
  headline: "Engineering Competencies & Protocols",
  description:
    "Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.",
};

const DEFAULT_PROJECTS_SECTION = {
  kicker: "PORTFOLIO OF WORK",
  headline: "Signature Engineering Deliverables",
  description:
    "Production-ready embedded hardware prototypes, IoT monitoring hubs, and high-performance software applications.",
};

const DEFAULT_TIMELINE_SECTION = {
  kicker: "CAREER & EDUCATION",
  headline: "Engineering Journey & Milestones",
  description:
    "The progressive path from first circuit prototypes to enterprise web platforms and IoT systems.",
};

// --------------------------------------------------
// SNAPSHOT REFRESH HELPERS
// --------------------------------------------------

async function refreshHeroSnapshot(): Promise<void> {
  const data = await HeroModel.findOne().lean();
  if (data) updateInMemoryState("hero", data);
}

async function refreshAboutSnapshot(): Promise<void> {
  const data = await AboutModel.findOne().lean();
  if (data) updateInMemoryState("about", data);
}

async function refreshSkillsSnapshot(): Promise<void> {
  const data = await SkillModel.find().sort({ order: 1 }).lean();
  updateInMemoryState("skills", data);
}

async function refreshSkillsSectionSnapshot(): Promise<void> {
  const data = await SkillsSectionModel.findOne().lean();
  if (data) updateInMemoryState("skillsSection", data);
}

async function refreshProjectsSnapshot(): Promise<void> {
  const data = await ProjectModel.find().sort({ order: 1 }).lean();
  updateInMemoryState("projects", data);
}

async function refreshProjectsSectionSnapshot(): Promise<void> {
  const data = await ProjectsSectionModel.findOne().lean();
  if (data) updateInMemoryState("projectsSection", data);
}

async function refreshJourneySnapshot(): Promise<void> {
  const data = await JourneyModel.find().sort({ order: 1 }).lean();
  updateInMemoryState("journey", data);
}

async function refreshTimelineSectionSnapshot(): Promise<void> {
  const data = await TimelineSectionModel.findOne().lean();
  if (data) updateInMemoryState("timelineSection", data);
}

async function refreshConnectSnapshot(): Promise<void> {
  const data = await ConnectModel.findOne().lean();
  if (data) updateInMemoryState("connect", data);
}

// Cache refresh is best-effort after a successful database write.
// A cache refresh failure must not make a successful save look unsuccessful.
async function refreshSafely(
  refresh: () => Promise<void>,
  section: string,
): Promise<void> {
  try {
    await refresh();
  } catch (error) {
    console.error(`[Snapshot] Failed to refresh ${section}:`, error);
  }
}

// --------------------------------------------------
// SECTION PAYLOAD VALIDATION
// --------------------------------------------------

function isValidSectionPayload(payload: unknown): payload is {
  kicker: string;
  headline: string;
  description: string;
} {
  if (!payload || typeof payload !== "object") return false;

  const value = payload as Record<string, unknown>;

  return (
    typeof value.kicker === "string" &&
    typeof value.headline === "string" &&
    typeof value.description === "string" &&
    value.kicker.trim().length > 0 &&
    value.headline.trim().length > 0 &&
    value.description.trim().length > 0
  );
}

function normalizeSectionPayload(payload: {
  kicker: string;
  headline: string;
  description: string;
}) {
  return {
    kicker: payload.kicker.trim(),
    headline: payload.headline.trim(),
    description: payload.description.trim(),
  };
}

// --------------------------------------------------
// DASHBOARD
// --------------------------------------------------

export async function getDashboardSummary(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    if (isDbConnected()) {
      const [
        totalVisitors,
        returningVisitors,
        totalProjects,
        publishedProjects,
        totalMessages,
        unreadMessages,
        recentVisitors,
        recentMessages,
      ] = await Promise.all([
        VisitorModel.countDocuments(),
        VisitorModel.countDocuments({ visitCount: { $gt: 1 } }),
        ProjectModel.countDocuments(),
        ProjectModel.countDocuments({ published: true }),
        MessageModel.countDocuments(),
        MessageModel.countDocuments({ status: "unread" }),
        VisitorModel.find().sort({ lastVisit: -1 }).limit(5).lean(),
        MessageModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

      res.json({
        success: true,
        summary: {
          totalVisitors,
          returningVisitors,
          newVisitors: Math.max(0, totalVisitors - returningVisitors),
          totalProjects,
          publishedProjects,
          draftProjects: totalProjects - publishedProjects,
          totalMessages,
          unreadMessages,
        },
        recentVisitors,
        recentMessages,
      });
      return;
    }

    const mem = getInMemoryState();

    res.json({
      success: true,
      summary: {
        totalVisitors: 12,
        returningVisitors: 4,
        newVisitors: 8,
        totalProjects: mem.projects.length,
        publishedProjects: mem.projects.filter((p) => p.published).length,
        draftProjects: mem.projects.filter((p) => !p.published).length,
        totalMessages: 3,
        unreadMessages: 1,
      },
      recentVisitors: [],
      recentMessages: [],
    });
  } catch (error: unknown) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// HERO
// --------------------------------------------------

export async function updateHero(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body;

    if (isDbConnected()) {
      const updated = await HeroModel.findOneAndUpdate({}, payload, {
        new: true,
        upsert: true,
        runValidators: true,
      });

      if (!updated) {
        res.status(500).json({
          success: false,
          error: "Unable to save Hero section.",
        });
        return;
      }

      updateInMemoryState("hero", updated.toObject());

      res.json({
        success: true,
        message: "Hero section saved successfully.",
        data: updated,
      });
      return;
    }

    const updated = {
      ...getInMemoryState().hero,
      ...payload,
    };

    updateInMemoryState("hero", updated);

    res.json({
      success: true,
      message: "Hero section updated in memory.",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("Error updating Hero:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// ABOUT
// --------------------------------------------------

export async function updateAbout(req: Request, res: Response): Promise<void> {
  try {
    const { kicker, headline, intro, pillars } = req.body;

    if (
      typeof kicker !== "string" ||
      typeof headline !== "string" ||
      typeof intro !== "string" ||
      !Array.isArray(pillars)
    ) {
      res.status(400).json({
        success: false,
        error: "Invalid About section payload.",
      });
      return;
    }

    if (pillars.length !== 3) {
      res.status(400).json({
        success: false,
        error: "Exactly three About cards are required.",
      });
      return;
    }

    const cardIds = ["academic-foundation", "hardware-focus", "software-focus"];

    const cardIcons = ["GraduationCap", "Cpu", "Code2"];

    for (const pillar of pillars) {
      if (
        !pillar ||
        typeof pillar.title !== "string" ||
        typeof pillar.subtitle !== "string" ||
        typeof pillar.description !== "string" ||
        !pillar.title.trim() ||
        !pillar.subtitle.trim() ||
        !pillar.description.trim()
      ) {
        res.status(400).json({
          success: false,
          error: "All three cards must have a title, heading and description.",
        });
        return;
      }
    }

    const existing = isDbConnected() ? await AboutModel.findOne() : null;

    const current = getInMemoryState().about;

    const previousPillars = existing?.pillars ?? current.pillars;

    const mergedPillars = pillars.map(
      (
        pillar: {
          title: string;
          subtitle: string;
          description: string;
        },
        index: number,
      ) => {
        const previous = previousPillars?.[index];

        return {
          id: previous?.id || cardIds[index],
          title: pillar.title.trim(),
          icon: previous?.icon || cardIcons[index],
          subtitle: pillar.subtitle.trim(),
          description: pillar.description.trim(),
          summary: previous?.summary || pillar.description.trim(),
          details: previous?.details || [],
          footerTag: previous?.footerTag,
        };
      },
    );

    const payload = {
      kicker: kicker.trim(),
      headline: headline.trim(),
      intro: intro.trim(),
      pillars: mergedPillars,
    };

    if (isDbConnected()) {
      const updated = await AboutModel.findOneAndUpdate(
        {},
        { $set: payload },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      if (!updated) {
        res.status(500).json({
          success: false,
          error: "Unable to save About section.",
        });
        return;
      }

      updateInMemoryState("about", updated.toObject());

      res.json({
        success: true,
        message: "About section saved successfully.",
        data: updated,
      });
      return;
    }

    const updated = {
      ...current,
      ...payload,
    };

    updateInMemoryState("about", updated);

    res.json({
      success: true,
      message: "About section updated in memory.",
      data: updated,
    });
  } catch (error: unknown) {
    console.error("Error updating About section:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// GENERIC SECTION GET / UPDATE HELPERS
// --------------------------------------------------

async function getSection(
  model: typeof SkillsSectionModel,
  defaultData: {
    kicker: string;
    headline: string;
    description: string;
  },
  cacheKey: "skillsSection" | "projectsSection" | "timelineSection",
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    if (isDbConnected()) {
      let section = await model.findOne();

      if (!section) {
        section = await model.create(defaultData);
      }

      updateInMemoryState(cacheKey, section.toObject());

      res.json({
        success: true,
        data: section,
      });
      return;
    }

    res.json({
      success: true,
      data: getInMemoryState()[cacheKey],
    });
  } catch (error: unknown) {
    console.error(`Error fetching ${cacheKey}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

async function updateSection(
  model: typeof SkillsSectionModel,
  cacheKey: "skillsSection" | "projectsSection" | "timelineSection",
  req: Request,
  res: Response,
  label: string,
): Promise<void> {
  try {
    if (!isValidSectionPayload(req.body)) {
      res.status(400).json({
        success: false,
        error: "Kicker, headline and description are required.",
      });
      return;
    }

    const payload = normalizeSectionPayload(req.body);

    if (isDbConnected()) {
      const updated = await model.findOneAndUpdate(
        {},
        { $set: payload },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

      if (!updated) {
        res.status(500).json({
          success: false,
          error: `Unable to save ${label} section.`,
        });
        return;
      }

      updateInMemoryState(cacheKey, updated.toObject());

      res.json({
        success: true,
        message: `${label} section updated successfully.`,
        data: updated,
      });
      return;
    }

    updateInMemoryState(cacheKey, payload);

    res.json({
      success: true,
      message: `${label} section updated in memory.`,
      data: payload,
    });
  } catch (error: unknown) {
    console.error(`Error updating ${label} section:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// SKILLS SECTION
// --------------------------------------------------

export async function getAdminSkillsSection(
  req: Request,
  res: Response,
): Promise<void> {
  await getSection(
    SkillsSectionModel,
    DEFAULT_SKILLS_SECTION,
    "skillsSection",
    req,
    res,
  );
}

export async function updateSkillsSection(
  req: Request,
  res: Response,
): Promise<void> {
  await updateSection(SkillsSectionModel, "skillsSection", req, res, "Skills");
}

// --------------------------------------------------
// SKILLS CRUD
// --------------------------------------------------

export async function getAdminSkills(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    if (isDbConnected()) {
      const skills = await SkillModel.find().sort({ order: 1 }).lean();
      res.json({ success: true, data: skills });
      return;
    }

    res.json({
      success: true,
      data: getInMemoryState().skills,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function createSkillCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { name, iconName = "Cpu", skills = [] } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        error: "Skill category name is required.",
      });
      return;
    }

    const id = req.body.id || name.toLowerCase().replace(/[^a-z0-9]/g, "-");

    if (isDbConnected()) {
      const highest = await SkillModel.findOne().sort({ order: -1 });
      const order = (highest?.order || 0) + 1;

      const created = await SkillModel.create({
        id,
        name: name.trim(),
        iconName,
        order,
        skills,
      });

      await refreshSafely(refreshSkillsSnapshot, "skills");

      res.status(201).json({
        success: true,
        message: "Skill category added.",
        data: created,
      });
      return;
    }

    const current = getInMemoryState().skills;
    const newCategory = {
      id,
      name: name.trim(),
      iconName,
      order: current.length + 1,
      skills,
    };

    updateInMemoryState("skills", [...current, newCategory]);

    res.status(201).json({
      success: true,
      message: "Skill category added.",
      data: newCategory,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function updateSkillCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (isDbConnected()) {
      const updated = await SkillModel.findOneAndUpdate({ id }, payload, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        res.status(404).json({
          success: false,
          error: "Skill category not found.",
        });
        return;
      }

      await refreshSafely(refreshSkillsSnapshot, "skills");

      res.json({
        success: true,
        message: "Skill category updated.",
        data: updated,
      });
      return;
    }

    const current = getInMemoryState().skills;
    const index = current.findIndex((category) => category.id === id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: "Skill category not found.",
      });
      return;
    }

    const updated = [...current];
    updated[index] = { ...updated[index], ...payload };

    updateInMemoryState("skills", updated);

    res.json({
      success: true,
      message: "Skill category updated.",
      data: updated[index],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function deleteSkillCategory(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await SkillModel.findOneAndDelete({ id });

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "Skill category not found.",
        });
        return;
      }

      await refreshSafely(refreshSkillsSnapshot, "skills");

      res.json({
        success: true,
        message: "Skill category deleted.",
      });
      return;
    }

    const current = getInMemoryState().skills;
    const updated = current.filter((category) => category.id !== id);

    if (updated.length === current.length) {
      res.status(404).json({
        success: false,
        error: "Skill category not found.",
      });
      return;
    }

    updateInMemoryState("skills", updated);

    res.json({
      success: true,
      message: "Skill category deleted.",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// PROJECTS SECTION
// --------------------------------------------------

export async function getAdminProjectsSection(
  req: Request,
  res: Response,
): Promise<void> {
  await getSection(
    ProjectsSectionModel,
    DEFAULT_PROJECTS_SECTION,
    "projectsSection",
    req,
    res,
  );
}

export async function updateProjectsSection(
  req: Request,
  res: Response,
): Promise<void> {
  await updateSection(
    ProjectsSectionModel,
    "projectsSection",
    req,
    res,
    "Projects",
  );
}

// --------------------------------------------------
// PROJECTS CRUD
// --------------------------------------------------

export async function getAdminProjects(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    if (isDbConnected()) {
      const projects = await ProjectModel.find().sort({ order: 1 }).lean();
      res.json({ success: true, data: projects });
      return;
    }

    res.json({
      success: true,
      data: getInMemoryState().projects,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function createProject(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, category, shortDescription, fullDescription, image } =
      req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof shortDescription !== "string" ||
      !shortDescription.trim()
    ) {
      res.status(400).json({
        success: false,
        error: "Title and short description are required.",
      });
      return;
    }

    const id =
      req.body.id ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .slice(0, 40) + `-${Date.now().toString().slice(-4)}`;

    const projectPayload = {
      ...req.body,
      id,
      title: title.trim(),
      category: category || "Embedded & IoT",
      fullDescription: fullDescription || shortDescription,
      image:
        image ||
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    };

    if (isDbConnected()) {
      const highest = await ProjectModel.findOne().sort({ order: -1 });
      const order = (highest?.order || 0) + 1;

      const created = await ProjectModel.create({
        ...projectPayload,
        order,
        published: req.body.published ?? true,
      });

      await refreshSafely(refreshProjectsSnapshot, "projects");

      res.status(201).json({
        success: true,
        message: "Project created successfully.",
        data: created,
      });
      return;
    }

    const projects = getInMemoryState().projects;
    const newProject = {
      ...projectPayload,
      order: projects.length + 1,
      published: req.body.published ?? true,
    };

    updateInMemoryState("projects", [...projects, newProject]);

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: newProject,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function updateProject(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (isDbConnected()) {
      const updated = await ProjectModel.findOneAndUpdate(
        { id },
        { $set: payload },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          error: "Project not found.",
        });
        return;
      }

      await refreshSafely(refreshProjectsSnapshot, "projects");

      res.json({
        success: true,
        message: "Project updated successfully.",
        data: updated,
      });
      return;
    }

    const current = getInMemoryState().projects;
    const index = current.findIndex((project) => project.id === id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: "Project not found.",
      });
      return;
    }

    const updated = [...current];
    updated[index] = { ...updated[index], ...payload };

    updateInMemoryState("projects", updated);

    res.json({
      success: true,
      message: "Project updated successfully.",
      data: updated[index],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await ProjectModel.findOneAndDelete({ id });

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "Project not found.",
        });
        return;
      }

      await refreshSafely(refreshProjectsSnapshot, "projects");

      res.json({
        success: true,
        message: "Project deleted successfully.",
      });
      return;
    }

    const current = getInMemoryState().projects;
    const updated = current.filter((project) => project.id !== id);

    if (updated.length === current.length) {
      res.status(404).json({
        success: false,
        error: "Project not found.",
      });
      return;
    }

    updateInMemoryState("projects", updated);

    res.json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// TIMELINE SECTION
// --------------------------------------------------

export async function getAdminTimelineSection(
  req: Request,
  res: Response,
): Promise<void> {
  await getSection(
    TimelineSectionModel,
    DEFAULT_TIMELINE_SECTION,
    "timelineSection",
    req,
    res,
  );
}

export async function updateTimelineSection(
  req: Request,
  res: Response,
): Promise<void> {
  await updateSection(
    TimelineSectionModel,
    "timelineSection",
    req,
    res,
    "Timeline",
  );
}

// --------------------------------------------------
// JOURNEY CRUD
// --------------------------------------------------

export async function getAdminJourney(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    if (isDbConnected()) {
      const journey = await JourneyModel.find().sort({ order: 1 }).lean();
      res.json({ success: true, data: journey });
      return;
    }

    res.json({
      success: true,
      data: getInMemoryState().journey,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function createJourney(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const payload = req.body;

    if (isDbConnected()) {
      const highest = await JourneyModel.findOne().sort({ order: -1 });
      const order = (highest?.order || 0) + 1;

      const created = await JourneyModel.create({
        ...payload,
        order,
      });

      await refreshSafely(refreshJourneySnapshot, "journey");

      res.status(201).json({
        success: true,
        message: "Journey milestone added.",
        data: created,
      });
      return;
    }

    const journey = getInMemoryState().journey;
    const newMilestone = {
      ...payload,
      order: journey.length + 1,
      published: payload.published ?? true,
    };

    updateInMemoryState("journey", [...journey, newMilestone]);

    res.status(201).json({
      success: true,
      message: "Journey milestone added.",
      data: newMilestone,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function updateJourney(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    const payload = req.body;

    if (isDbConnected()) {
      const updated = await JourneyModel.findByIdAndUpdate(
        id,
        { $set: payload },
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updated) {
        res.status(404).json({
          success: false,
          error: "Journey milestone not found.",
        });
        return;
      }

      await refreshSafely(refreshJourneySnapshot, "journey");

      res.json({
        success: true,
        message: "Journey milestone updated.",
        data: updated,
      });
      return;
    }

    const current = getInMemoryState().journey;
    const index = current.findIndex(
      (milestone) =>
        (milestone as { _id?: string })._id === id ||
        (milestone as { id?: string }).id === id ||
        milestone.year === id,
    );

    if (index === -1) {
      res.status(404).json({
        success: false,
        error: "Journey milestone not found.",
      });
      return;
    }

    const updated = [...current];
    updated[index] = { ...updated[index], ...payload };

    updateInMemoryState("journey", updated);

    res.json({
      success: true,
      message: "Journey milestone updated.",
      data: updated[index],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function deleteJourney(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await JourneyModel.findByIdAndDelete(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "Journey milestone not found.",
        });
        return;
      }

      await refreshSafely(refreshJourneySnapshot, "journey");

      res.json({
        success: true,
        message: "Journey milestone deleted.",
      });
      return;
    }

    const current = getInMemoryState().journey;
    const updated = current.filter(
      (milestone) =>
        (milestone as { _id?: string })._id !== id &&
        (milestone as { id?: string }).id !== id &&
        milestone.year !== id,
    );

    if (updated.length === current.length) {
      res.status(404).json({
        success: false,
        error: "Journey milestone not found.",
      });
      return;
    }

    updateInMemoryState("journey", updated);

    res.json({
      success: true,
      message: "Journey milestone deleted.",
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

// --------------------------------------------------
// CONNECT
// --------------------------------------------------

export async function updateConnect(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const payload = req.body;

    if (isDbConnected()) {
      const updated = await ConnectModel.findOneAndUpdate(
        {},
        { $set: payload },
        {
          new: true,
          upsert: true,
          runValidators: true,
        },
      );

      if (!updated) {
        res.status(500).json({
          success: false,
          error: "Unable to save Connect section.",
        });
        return;
      }

      updateInMemoryState("connect", updated.toObject());

      res.json({
        success: true,
        message: "Connect section updated successfully.",
        data: updated,
      });
      return;
    }

    const updated = {
      ...getInMemoryState().connect,
      ...payload,
    };

    updateInMemoryState("connect", updated);

    res.json({
      success: true,
      message: "Connect section updated.",
      data: updated,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
