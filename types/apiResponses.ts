export type QuestStatus = "NotStarted" | "InProgress" | "Completed";

export interface CreatedResponse {
  code: string;
  message: string;
}

export interface UpdatedResponse {
  code: string;
  message: string;
}

export interface DeletedResponse {
  code: string;
  message: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
}