import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    createEstimate,
    getEstimatesRequest,
} from "../../controllers/EstimateController";

import * as connector from "../../connectors/EstimateConnector";
import type { CreateEstimate } from "../../types/schema/EstimateSchema";

// Mock the connector
vi.mock("@/connectors/EstimateConnector", () => ({
  fetchEstimates: vi.fn(),
  postEstimate: vi.fn(),
}));

describe("EstimateController", () => {
  const userId = "dev123";
  const questId = "quest456";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getEstimatesRequest", () => {
    it("should return parsed estimates on valid response", async () => {
        
      const mockData = [
        {
          username: "dev123",
          rank: "iron",
          comment: "Challenging but manageable",
        },
      ];

      vi.mocked(connector.fetchEstimates).mockResolvedValueOnce(mockData);

      const result = await getEstimatesRequest(userId, questId);

      expect(result).toEqual(mockData);
      expect(connector.fetchEstimates).toHaveBeenCalledWith(
        userId,
        questId,
        undefined
      );
    });

    it("should throw error on invalid response data", async () => {
      const invalidData = [{ bad: "data" }];

      vi.mocked(connector.fetchEstimates).mockResolvedValueOnce(invalidData);

      await expect(() => getEstimatesRequest(userId, questId)).rejects.toThrow(
        "Invalid estimate data received from backend"
      );
    });
  });

  describe("createEstimate", () => {
    it("should delegate to postEstimate with correct args", async () => {
      const payload: CreateEstimate = {
        questId: "quest456",
        rank: "steel",
        reasoning: "Some solid reasoning",
      };

      const mockResponse = { ok: true };
      vi.mocked(connector.postEstimate).mockResolvedValueOnce(mockResponse);

      const result = await createEstimate(userId, payload);

      expect(result).toEqual(mockResponse);
      expect(connector.postEstimate).toHaveBeenCalledWith(userId, payload);
    });
  });
});
