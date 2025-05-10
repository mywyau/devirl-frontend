export type QuestStatus = "NotStarted" | "InProgress" | "Completed";

export interface QuestPartial {
  userId: string;
  questId: string;
  title: string;
  description?: string;
  status?: QuestStatus;
}

export interface CreateQuestPayload {
  title: string;
  description?: string;
}
