export interface QuestPartial {
  userId: string;
  questId: string;
  title: string;
  description?: string;
  status?: QuestStatus;
}

