export interface CreateQuestPayload {
  rank: string,
  title: string,
  description: string,
  acceptanceCriteria: string,
  tags: string[];
}

export interface UpdateQuestPayload {
  rank: string;
  title: string;
  description?: string;
  acceptanceCriteria: string;
}

export interface AcceptQuestPayload {
  devId: string;
  questId: string;
}
