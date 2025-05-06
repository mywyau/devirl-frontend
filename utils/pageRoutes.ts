// utils/routes.ts



export const PageRoutes = {
  home: "/",
  login: "/login",
  questDashboard: "/quest-dashboard",
  postQuest: "/quests/new",
  allQuests: "/quests",
  questById: (id: string) => `/quests/${id}`,
};
