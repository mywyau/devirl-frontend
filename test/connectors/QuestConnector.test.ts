import {
    acceptQuestRequest,
    completeQuestRequest,
    createQuestRequest,
    deleteQuestRequest,
    fetchNDJSONStreamRequest,
    getQuestRequest,
    updateQuestRequest,
    updateQuestStatusRequest,
} from "../../connectors/QuestConnector";

import { $fetch } from "ofetch";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch globally
global.fetch = vi.fn();

vi.mock("ofetch", () => ({
  $fetch: vi.fn(),
}));

describe("QuestConnector", () => {
  const userId = "test-user";
  const questId = "test-quest";
  const headers = { Authorization: "Bearer token" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getQuestRequest calls $fetch with correct config", async () => {
    await getQuestRequest(userId, questId, { headers });
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/quest/${userId}/${questId}`),
      {
        method: "GET",
        credentials: "include",
        headers,
      }
    );
  });

  it("createQuestRequest sends a POST with body", async () => {
    const body = {
      rank: "Bronze",
      title: "Fix UI",
      description: "Align the button",
      acceptanceCriteria: "Pass visual test",
      tags: ["ui"],
    };
    await createQuestRequest(userId, body as any);
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/quest/create/${userId}`),
      {
        method: "POST",
        credentials: "include",
        body,
      }
    );
  });

  it("updateQuestRequest sends a PUT with body", async () => {
    const body = {
      rank: "Iron",
      title: "Fix backend",
      acceptanceCriteria: "Tests pass",
    };
    await updateQuestRequest(userId, questId, body);
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/update/details/${userId}/${questId}`),
      {
        method: "PUT",
        credentials: "include",
        body,
      }
    );
  });

  it("completeQuestRequest sends a PUT with payload", async () => {
    const body = { xpAwarded: 500 };
    await completeQuestRequest(userId, questId, body as any);
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/complete/award/xp/${userId}/${questId}`),
      {
        method: "PUT",
        credentials: "include",
        body,
      }
    );
  });

  it("updateQuestStatusRequest sends a PUT with status", async () => {
    const body = { status: "InProgress" };
    await updateQuestStatusRequest(userId, questId, body as any);
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/update/status/${userId}/${questId}`),
      {
        method: "PUT",
        credentials: "include",
        body,
      }
    );
  });

  it("acceptQuestRequest sends a PUT with dev and quest ID", async () => {
    const body = { devId: "dev1", questId: "quest123" };
    await acceptQuestRequest(userId, body);
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/accept/quest/${userId}`),
      {
        method: "PUT",
        credentials: "include",
        body,
      }
    );
  });

  it("deleteQuestRequest sends a DELETE request", async () => {
    await deleteQuestRequest(userId, questId);
    expect($fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/quest/${userId}/${questId}`),
      {
        method: "DELETE",
        credentials: "include",
      }
    );
  });

  it("fetchNDJSONStreamRequest uses native fetch with NDJSON headers", async () => {
    const mockResponse = { ok: true, body: {} } as Response;
    (fetch as any).mockResolvedValueOnce(mockResponse);

    const url = "https://mock.url/stream";
    const res = await fetchNDJSONStreamRequest(url, { headers });

    expect(fetch).toHaveBeenCalledWith(url, {
      credentials: "include",
      headers: {
        Accept: "application/x-ndjson",
        ...headers,
      },
    });
    expect(res).toEqual(mockResponse);
  });
});
