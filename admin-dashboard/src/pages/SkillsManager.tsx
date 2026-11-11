import React, { useCallback, useEffect, useState } from "react";
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Layers3,
} from "lucide-react";
import { api } from "../services/api";

type SkillItem = {
  name: string;
  // Keep legacy CMS properties if they already exist in the database.
  // The public Skills carousel displays names only.
  desc?: string;
  level?: string;
  highlight?: boolean;
  [key: string]: unknown;
};

type SkillCategory = {
  id: string;
  name: string;
  iconName?: string;
  skills: SkillItem[];
  [key: string]: unknown;
};

type EditingCategory = SkillCategory & {
  isNew?: boolean;
};

export function SkillsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [editingCategory, setEditingCategory] =
    useState<EditingCategory | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Public Skills section heading content (stored separately from skill categories).
  const [sectionLoading, setSectionLoading] = useState(true);
  const [sectionSaving, setSectionSaving] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [skillsSection, setSkillsSection] = useState({
    kicker: "TECHNICAL ARSENAL",
    headline: "Engineering Competencies & Protocols",
    description:
      "Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.",
  });

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getSkills();

      if (response?.success) {
        setCategories(Array.isArray(response.data) ? response.data : []);
      } else {
        setError("Unable to load skill categories.");
      }
    } catch (err) {
      console.error("Failed to load skills:", err);
      setError(
        "Could not load skills. Check the API connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSkillsSection = useCallback(async () => {
    setSectionLoading(true);
    setSectionError(null);

    try {
      const response = await api.getSkillsSection();
      if (!response?.success || !response.data) {
        throw new Error("Unable to load Skills section content.");
      }

      setSkillsSection({
        kicker: response.data.kicker || "TECHNICAL ARSENAL",
        headline:
          response.data.headline || "Engineering Competencies & Protocols",
        description:
          response.data.description ||
          "Proficiency spanning low-level bare-metal firmware, communications buses, and modern full-stack web platforms.",
      });
    } catch (err) {
      console.error("Failed to load Skills section content:", err);
      setSectionError(
        err instanceof Error
          ? err.message
          : "Could not load Skills section content.",
      );
    } finally {
      setSectionLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSkills();
    loadSkillsSection();
  }, [loadSkills, loadSkillsSection]);

  const handleSaveSkillsSection = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (sectionSaving) return;

    const payload = {
      kicker: skillsSection.kicker.trim(),
      headline: skillsSection.headline.trim(),
      description: skillsSection.description.trim(),
    };

    if (!payload.kicker || !payload.headline || !payload.description) {
      showToast(
        "Complete all three Skills section heading fields before saving.",
      );
      return;
    }

    setSectionSaving(true);
    try {
      const response = await api.updateSkillsSection(payload);
      if (!response?.success || !response.data) {
        throw new Error(response?.message || "Skills section update failed.");
      }

      setSkillsSection({
        kicker: response.data.kicker,
        headline: response.data.headline,
        description: response.data.description,
      });
      showToast("Skills section heading updated successfully.");
    } catch (err) {
      console.error("Failed to update Skills section heading:", err);
      showToast(
        err instanceof Error
          ? err.message
          : "Could not save Skills section heading.",
      );
    } finally {
      setSectionSaving(false);
    }
  };

  const openNewCategory = () => {
    setEditingCategory({
      isNew: true,
      id: `cat-${Date.now()}`,
      name: "",
      iconName: "Cpu",
      skills: [],
    });
  };

  const updateSkillName = (index: number, name: string) => {
    if (!editingCategory) return;

    const updatedSkills = [...(editingCategory.skills || [])];
    updatedSkills[index] = {
      ...updatedSkills[index],
      name,
    };

    setEditingCategory({
      ...editingCategory,
      skills: updatedSkills,
    });
  };

  const addSkill = () => {
    if (!editingCategory) return;

    setEditingCategory({
      ...editingCategory,
      skills: [...(editingCategory.skills || []), { name: "" }],
    });
  };

  const removeSkill = (index: number) => {
    if (!editingCategory) return;

    setEditingCategory({
      ...editingCategory,
      skills: editingCategory.skills.filter(
        (_, skillIndex) => skillIndex !== index,
      ),
    });
  };

  const moveSkill = (index: number, direction: -1 | 1) => {
    if (!editingCategory) return;

    const skills = [...editingCategory.skills];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= skills.length) return;

    [skills[index], skills[targetIndex]] = [skills[targetIndex], skills[index]];

    setEditingCategory({
      ...editingCategory,
      skills,
    });
  };

  const handleSaveCategory = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!editingCategory || saving) return;

    const categoryName = editingCategory.name.trim();
    const cleanedSkills = editingCategory.skills
      .map((skill) => ({
        ...skill,
        name: (skill.name || "").trim(),
      }))
      .filter((skill) => skill.name.length > 0);

    if (!categoryName) {
      showToast("Enter a category title before saving.");
      return;
    }

    if (cleanedSkills.length === 0) {
      showToast("Add at least one skill to this category.");
      return;
    }

    setSaving(true);

    try {
      // Preserve existing category and skill metadata while editing names/order.
      const payload: SkillCategory = {
        ...editingCategory,
        name: categoryName,
        skills: cleanedSkills,
      };
      delete (payload as EditingCategory).isNew;

      if (editingCategory.isNew) {
        const response = await api.createSkillCategory(payload);

        if (!response?.success || !response.data) {
          throw new Error(response?.message || "Category creation failed.");
        }

        setCategories((current) => [...current, response.data]);
        showToast("Skill category created.");
      } else {
        const response = await api.updateSkillCategory(
          editingCategory.id,
          payload,
        );

        if (!response?.success || !response.data) {
          throw new Error(response?.message || "Category update failed.");
        }

        setCategories((current) =>
          current.map((category) =>
            category.id === editingCategory.id ? response.data : category,
          ),
        );
        showToast("Skill category updated.");
      }

      setEditingCategory(null);
    } catch (err) {
      console.error("Failed to save skill category:", err);
      showToast(
        err instanceof Error ? err.message : "Could not save this category.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: SkillCategory) => {
    const confirmed = window.confirm(
      `Delete "${category.name}" and all ${category.skills?.length || 0} skills in it?`,
    );

    if (!confirmed) return;

    try {
      await api.deleteSkillCategory(category.id);
      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
      showToast("Skill category deleted.");
    } catch (err) {
      console.error("Failed to delete skill category:", err);
      showToast(
        err instanceof Error ? err.message : "Could not delete this category.",
      );
    }
  };

  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      category.name.toLowerCase().includes(query) ||
      (category.skills || []).some((skill) =>
        skill.name.toLowerCase().includes(query),
      )
    );
  });

  return (
    <div className="skills-cms space-y-6">
      <style>{`
        .skills-cms {
          color: #e9ddf7;
        }
        .skills-cms-panel {
          background: linear-gradient(145deg, rgba(35, 14, 57, .96), rgba(17, 9, 30, .98));
          border: 1px solid rgba(168, 85, 247, .24);
          box-shadow: 0 18px 55px rgba(0, 0, 0, .18);
        }
        .skills-cms-input {
          width: 100%;
          border: 1px solid rgba(168, 85, 247, .25);
          border-radius: 11px;
          background: rgba(7, 4, 16, .72);
          color: #f8f5ff;
          padding: 10px 12px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .skills-cms-input:focus {
          border-color: rgba(192, 132, 252, .85);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, .12);
        }
        .skills-cms-input::placeholder {
          color: #796b8e;
        }
        .skills-cms-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, .4) transparent;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-purple-500/20 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-white sm:text-3xl">
            Skills & Protocols CMS
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">
            Manage the five skill domains and the skill names displayed in the
            public carousel. The category order here determines the carousel
            order.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={loadSkills}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-400/25 bg-purple-500/10 px-3.5 py-2.5 text-xs font-semibold text-purple-200 transition hover:border-purple-300/50 hover:bg-purple-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openNewCategory}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/30 transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Add category
          </button>
        </div>
      </div>

      {/* Status */}
      {toast && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-400/25 bg-rose-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-rose-200">{error}</p>
          <button
            type="button"
            onClick={loadSkills}
            className="text-xs font-semibold text-rose-200 underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      )}

      {/* Public Skills section heading editor */}
      <section className="skills-cms-panel rounded-2xl p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[.2em] text-purple-300">
              PUBLIC SECTION CONTENT
            </p>
            <h2 className="mt-1 font-serif-display text-xl font-bold text-white">
              Skills Section Heading
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">
              Edit the kicker, main heading, and description displayed above the
              public Skills carousel.
            </p>
          </div>
          <button
            type="button"
            onClick={loadSkillsSection}
            disabled={sectionLoading || sectionSaving}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-purple-400/25 bg-purple-500/10 px-3.5 py-2.5 text-xs font-semibold text-purple-200 transition hover:bg-purple-500/20 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${sectionLoading ? "animate-spin" : ""}`}
            />
            Reload heading
          </button>
        </div>

        {sectionError && (
          <div className="mb-4 flex flex-col gap-2 rounded-xl border border-rose-400/25 bg-rose-500/10 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-rose-200">{sectionError}</p>
            <button
              type="button"
              onClick={loadSkillsSection}
              className="text-xs font-semibold text-rose-200 underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        <form onSubmit={handleSaveSkillsSection} className="space-y-4">
          <div>
            <label
              htmlFor="skills-section-kicker"
              className="mb-2 block font-mono text-[10px] tracking-[.15em] text-slate-300"
            >
              KICKER / EYEBROW TEXT
            </label>
            <input
              id="skills-section-kicker"
              required
              maxLength={80}
              value={skillsSection.kicker}
              onChange={(event) =>
                setSkillsSection((current) => ({
                  ...current,
                  kicker: event.target.value,
                }))
              }
              placeholder="e.g. TECHNICAL ARSENAL"
              className="skills-cms-input"
              disabled={sectionLoading || sectionSaving}
            />
          </div>

          <div>
            <label
              htmlFor="skills-section-headline"
              className="mb-2 block font-mono text-[10px] tracking-[.15em] text-slate-300"
            >
              MAIN HEADLINE
            </label>
            <input
              id="skills-section-headline"
              required
              maxLength={160}
              value={skillsSection.headline}
              onChange={(event) =>
                setSkillsSection((current) => ({
                  ...current,
                  headline: event.target.value,
                }))
              }
              placeholder="e.g. Engineering Competencies & Protocols"
              className="skills-cms-input"
              disabled={sectionLoading || sectionSaving}
            />
          </div>

          <div>
            <label
              htmlFor="skills-section-description"
              className="mb-2 block font-mono text-[10px] tracking-[.15em] text-slate-300"
            >
              SECTION DESCRIPTION
            </label>
            <textarea
              id="skills-section-description"
              required
              maxLength={500}
              rows={3}
              value={skillsSection.description}
              onChange={(event) =>
                setSkillsSection((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe the technical skills shown in this section..."
              className="skills-cms-input resize-y"
              disabled={sectionLoading || sectionSaving}
            />
            <p className="mt-1 text-right text-[10px] text-slate-500">
              {skillsSection.description.length}/500 characters
            </p>
          </div>

          <div className="flex flex-col gap-3 border-t border-purple-400/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-slate-500">
              {sectionLoading
                ? "Loading saved heading..."
                : "Changes are saved to the Skills Section document in MongoDB."}
            </p>
            <button
              type="submit"
              disabled={sectionLoading || sectionSaving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/30 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
            >
              {sectionSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {sectionSaving ? "Saving heading..." : "Save section heading"}
            </button>
          </div>
        </form>
      </section>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="skills-cms-panel rounded-2xl p-4">
          <p className="font-mono text-[9px] tracking-[.18em] text-slate-500">
            SKILL DOMAINS
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            {categories.length}
          </p>
        </div>
        <div className="skills-cms-panel rounded-2xl p-4">
          <p className="font-mono text-[9px] tracking-[.18em] text-slate-500">
            TOTAL SKILLS
          </p>
          <p className="mt-2 text-2xl font-bold text-purple-300">
            {categories.reduce(
              (total, category) => total + (category.skills?.length || 0),
              0,
            )}
          </p>
        </div>
        <div className="skills-cms-panel col-span-2 rounded-2xl p-4 lg:col-span-1">
          <p className="font-mono text-[9px] tracking-[.18em] text-slate-500">
            PUBLIC DISPLAY
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-300">
            Carousel · Skill names only
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-300" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Find a category or skill..."
          aria-label="Search skill categories"
          className="skills-cms-input pl-10"
        />
      </div>

      {/* Categories */}
      {loading ? (
        <div className="skills-cms-panel flex min-h-52 items-center justify-center rounded-2xl">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <RefreshCw className="h-4 w-4 animate-spin text-purple-300" />
            Loading skill domains...
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="skills-cms-panel rounded-2xl px-5 py-14 text-center">
          <Layers3 className="mx-auto h-8 w-8 text-purple-300/70" />
          <p className="mt-3 text-sm font-semibold text-white">
            No skill categories found
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try another search or create a new category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredCategories.map((category, index) => (
            <article
              key={category.id}
              className="skills-cms-panel group overflow-hidden rounded-2xl"
            >
              <div className="flex items-start justify-between gap-3 border-b border-purple-400/15 px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-400/25 bg-purple-500/10 text-purple-300">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[9px] tracking-[.18em] text-purple-300/70">
                      DOMAIN{" "}
                      {String(
                        categories.findIndex(
                          (item) => item.id === category.id,
                        ) + 1,
                      ).padStart(2, "0")}
                    </p>
                    <h2 className="truncate font-serif-display text-lg font-bold text-white">
                      {category.name}
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {category.skills?.length || 0} skills in carousel
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingCategory({
                        ...category,
                        skills: (category.skills || []).map((skill) => ({
                          ...skill,
                        })),
                        isNew: false,
                      })
                    }
                    aria-label={`Edit ${category.name}`}
                    title="Edit category"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-purple-500/15 hover:text-purple-200"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    aria-label={`Delete ${category.name}`}
                    title="Delete category"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[.18em] text-slate-500">
                    SKILL LIST
                  </span>
                  <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-1 font-mono text-[9px] text-purple-200">
                    {String(category.skills?.length || 0).padStart(2, "0")}{" "}
                    ITEMS
                  </span>
                </div>

                <div className="skills-cms-scroll max-h-64 space-y-1 overflow-y-auto pr-1">
                  {(category.skills || []).map((skill, skillIndex) => (
                    <div
                      key={`${skill.name}-${skillIndex}`}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition hover:bg-white/[.035]"
                    >
                      <span className="font-mono text-[10px] text-purple-400/70">
                        {String(skillIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-slate-200">
                        {skill.name}
                      </span>
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-purple-400/60" />
                    </div>
                  ))}
                  {(!category.skills || category.skills.length === 0) && (
                    <p className="py-5 text-center text-xs text-slate-500">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-purple-400/15 bg-black/10 px-5 py-3">
                <span className="font-mono text-[9px] text-slate-500">
                  CAROUSEL MODULE {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setEditingCategory({
                      ...category,
                      skills: (category.skills || []).map((skill) => ({
                        ...skill,
                      })),
                      isNew: false,
                    })
                  }
                  className="text-[10px] font-semibold text-purple-300 transition hover:text-white"
                >
                  Manage skills →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Editor modal */}
      {editingCategory && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="skills-editor-title"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setEditingCategory(null);
            }
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-purple-400/30 bg-[#160b28] shadow-[0_25px_100px_rgba(0,0,0,.65)]">
            <div className="flex items-start justify-between gap-4 border-b border-purple-400/20 px-5 py-4 sm:px-6">
              <div>
                <p className="font-mono text-[9px] tracking-[.2em] text-purple-300">
                  SKILLS CONTENT EDITOR
                </p>
                <h2
                  id="skills-editor-title"
                  className="mt-1 font-serif-display text-xl font-bold text-white"
                >
                  {editingCategory.isNew
                    ? "Create skill domain"
                    : "Edit skill domain"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Only skill names are shown in the public carousel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !saving && setEditingCategory(null)}
                disabled={saving}
                aria-label="Close editor"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="skills-cms-scroll max-h-[65vh] space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-2 block font-mono text-[10px] tracking-[.15em] text-slate-300"
                  >
                    CATEGORY TITLE
                  </label>
                  <input
                    id="category-name"
                    required
                    autoFocus
                    value={editingCategory.name}
                    onChange={(event) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: event.target.value,
                      })
                    }
                    placeholder="e.g. Embedded Systems"
                    className="skills-cms-input"
                  />
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    This title appears in the category navigation and carousel
                    card.
                  </p>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <label className="block font-mono text-[10px] tracking-[.15em] text-slate-300">
                        SKILLS IN THIS DOMAIN
                      </label>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Add, rename, remove, or reorder skill names.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-purple-400/30 bg-purple-500/10 px-3 py-2 text-[11px] font-semibold text-purple-200 transition hover:bg-purple-500/20"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add skill
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingCategory.skills.map((skill, index) => (
                      <div
                        key={`edit-${index}`}
                        className="flex items-center gap-2 rounded-xl border border-purple-400/15 bg-black/20 p-2"
                      >
                        <span className="w-6 shrink-0 text-center font-mono text-[10px] text-purple-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <input
                          value={skill.name}
                          onChange={(event) =>
                            updateSkillName(index, event.target.value)
                          }
                          placeholder="Enter skill name"
                          aria-label={`Skill ${index + 1} name`}
                          className="skills-cms-input min-w-0 flex-1 py-2 text-xs"
                        />
                        <div className="flex shrink-0 items-center">
                          <button
                            type="button"
                            onClick={() => moveSkill(index, -1)}
                            disabled={index === 0}
                            aria-label={`Move ${skill.name || "skill"} up`}
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-purple-500/15 hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSkill(index, 1)}
                            disabled={
                              index === editingCategory.skills.length - 1
                            }
                            aria-label={`Move ${skill.name || "skill"} down`}
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-purple-500/15 hover:text-purple-200 disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            aria-label={`Remove ${skill.name || "skill"}`}
                            className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {editingCategory.skills.length === 0 && (
                      <div className="rounded-xl border border-dashed border-purple-400/25 px-4 py-8 text-center">
                        <Layers3 className="mx-auto h-6 w-6 text-purple-300/60" />
                        <p className="mt-2 text-xs text-slate-300">
                          This domain has no skills yet.
                        </p>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="mt-2 text-xs font-semibold text-purple-300 hover:text-white"
                        >
                          Add the first skill
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-purple-400/20 bg-black/15 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  disabled={saving}
                  className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/30 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
