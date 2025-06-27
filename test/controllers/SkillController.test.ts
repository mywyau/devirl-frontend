import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getSkill,
  getHiscoreSkill,
} from "../../controllers/SkillController";

import * as connector from "../../connectors/SkillConnector";
import { SkillDataSchema } from "../../types/schema/SkillDataSchema";

// Mock connector functions
vi.mock("@/connectors/SkillConnector", () => ({
  fetchSkill: vi.fn(),
  fetchHiscoreSkill: vi.fn(),
}));

describe("SkillController", () => {
  const devId = "dev123";
  const skill = "Questing";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSkill", () => {
    it("returns valid parsed skill data", async () => {
      const mockData = {
        devId: "dev123",
        username: "goku",
        skill: "Questing",
        level: 5,
        xp: 500,
      };

      vi.mocked(connector.fetchSkill).mockResolvedValueOnce(mockData);

      const result = await getSkill(devId, skill);
      expect(result).toEqual(mockData);
      expect(SkillDataSchema.safeParse(result).success).toBe(true);
    });

    it("throws on invalid skill response", async () => {
      const invalidData = {
        username: "vegeta",
        level: 99,
        xp: 1000000,
        // missing devId and skill
      };

      vi.mocked(connector.fetchSkill).mockResolvedValueOnce(invalidData);

      await expect(() => getSkill(devId, skill)).rejects.toThrow(
        "Invalid skill data received from backend"
      );
    });
  });

  describe("getHiscoreSkill", () => {
    it("returns parsed array of skill data", async () => {
      const mockData = [
        {
          devId: "dev123",
          username: "goku",
          skill: "Questing",
          level: 6,
          xp: 600,
        },
        {
          devId: "dev456",
          username: "vegeta",
          skill: "Questing",
          level: 10,
          xp: 1000,
        },
      ];

      vi.mocked(connector.fetchHiscoreSkill).mockResolvedValueOnce(mockData);

      const result = await getHiscoreSkill(skill);
      expect(result).toEqual(mockData);
      result.forEach((item) =>
        expect(SkillDataSchema.safeParse(item).success).toBe(true)
      );
    });

    it("throws on invalid hiscore skill data", async () => {
      const invalidData = [
        {
          username: "gohan",
          skill: "Questing",
          xp: 900,
          // missing devId and level
        },
      ];

      vi.mocked(connector.fetchHiscoreSkill).mockResolvedValueOnce(invalidData);

      await expect(() => getHiscoreSkill(skill)).rejects.toThrow(
        "Invalid skill data received from backend"
      );
    });
  });
});
