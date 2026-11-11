const API_BASE = "/api";

export type SkillsSectionData = {
  kicker: string;
  headline: string;
  description: string;
};

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem("gnani_admin_token");
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem("gnani_admin_token", token);
  } catch {
    // Ignored
  }
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem("gnani_admin_token");
  } catch {
    // Ignored
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && endpoint !== "/auth/login") {
      removeAuthToken();
      window.dispatchEvent(new Event("gnani_admin_unauthorized"));
    }
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; admin: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => request<{ success: boolean; admin: any }>("/auth/me"),

  updateProfile: (profile: any) =>
    request<{ success: boolean; message: string; admin: any }>(
      "/auth/profile",
      {
        method: "PUT",
        body: JSON.stringify(profile),
      },
    ),

  // Dashboard Summary
  getDashboardSummary: () =>
    request<{
      success: boolean;
      summary: any;
      recentVisitors: any[];
      recentMessages: any[];
    }>("/admin/dashboard"),

  // Public data fetch for preview/baseline
  getPortfolioData: () =>
    request<{ success: boolean; data: any }>("/portfolio"),

  // Hero
  updateHero: (data: any) =>
    request<{ success: boolean; message: string; data: any }>("/admin/hero", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // About
  updateAbout: (data: any) =>
    request<{ success: boolean; message: string; data: any }>("/admin/about", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Skills
  getSkills: () => request<{ success: boolean; data: any[] }>("/admin/skills"),

  createSkillCategory: (data: any) =>
    request<{ success: boolean; message: string; data: any }>("/admin/skills", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSkillCategory: (id: string, data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      `/admin/skills/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),

  deleteSkillCategory: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/skills/${id}`, {
      method: "DELETE",
    }),

  // Skills Section Heading
  getSkillsSection: () =>
    request<{ success: boolean; data: SkillsSectionData }>(
      "/admin/skills-section",
    ),

  updateSkillsSection: (data: SkillsSectionData) =>
    request<{
      success: boolean;
      message: string;
      data: SkillsSectionData;
    }>("/admin/skills-section", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Projects
  getProjects: () =>
    request<{ success: boolean; data: any[] }>("/admin/projects"),
  createProject: (data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      "/admin/projects",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  updateProject: (id: string, data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      `/admin/projects/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  deleteProject: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/projects/${id}`, {
      method: "DELETE",
    }),

  // Journey
  getJourney: () =>
    request<{ success: boolean; data: any[] }>("/admin/journey"),
  createJourney: (data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      "/admin/journey",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),
  updateJourney: (id: string, data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      `/admin/journey/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),
  deleteJourney: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/journey/${id}`, {
      method: "DELETE",
    }),

  // Connect
  updateConnect: (data: any) =>
    request<{ success: boolean; message: string; data: any }>(
      "/admin/connect",
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    ),

  // Visitors
  getVisitors: (
    params: { page?: number; limit?: number; search?: string } = {},
  ) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", params.page.toString());
    if (params.limit) q.set("limit", params.limit.toString());
    if (params.search) q.set("search", params.search);
    return request<{
      success: boolean;
      stats: any;
      pagination: any;
      visitors: any[];
    }>(`/visitors?${q.toString()}`);
  },

  // Messages
  getMessages: (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
  ) => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", params.page.toString());
    if (params.limit) q.set("limit", params.limit.toString());
    if (params.status) q.set("status", params.status);
    if (params.search) q.set("search", params.search);
    return request<{
      success: boolean;
      unreadCount: number;
      pagination: any;
      messages: any[];
    }>(`/messages?${q.toString()}`);
  },
  updateMessageStatus: (id: string, status: "read" | "unread" | "archived") =>
    request<{ success: boolean; message: string; data: any }>(
      `/messages/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      },
    ),
  deleteMessage: (id: string) =>
    request<{ success: boolean; message: string }>(`/messages/${id}`, {
      method: "DELETE",
    }),
};
