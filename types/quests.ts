export interface QuestStatusBase {
  type: "NotStarted" | "InProgress" | "Completed";
  toString(): string;
}

const NotStarted: QuestStatusBase = {
  type: "NotStarted",
  toString: () => "Not Started",
};

const InProgress: QuestStatusBase = {
  type: "InProgress",
  toString: () => "In Progress",
};

const Completed: QuestStatusBase = {
  type: "Completed",
  toString: () => "Completed",
};


// export type QuestStatus = "NotStarted" | "InProgress" | "Completed";

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

export interface UpdateQuestPayload {
  title: string;
  description?: string;
}
