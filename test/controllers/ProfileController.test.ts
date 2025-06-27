import { beforeEach, describe, expect, it, vi } from "vitest";
import * as connector from "../../connectors/ProfileConnector";
import { getAllProfileSkillData } from "../../controllers/ProfileController";
import { ProfileDataSchema } from "../../types/schema/ProfileDataSchema";

// Mock connector
vi.mock("@/connectors/ProfileConnector", () => ({
  fetchAllProfileSkillData: vi.fn(),
}));

describe("ProfileController", () => {
  const devId = "dev123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns parsed profile skill data on valid response", async () => {
    const mockData = [
      {
        devId: "dev123",
        username: "vegeta",
        skillData: [
          {
            skill: "Questing",
            skillLevel: 40,
            skillXp: 60000,
          },
        ],
        languageData: [
          {
            language: "Python",
            languageLevel: 40,
            languageXp: 60000,
          },
        ],
      },
    ];

    vi.mocked(connector.fetchAllProfileSkillData).mockResolvedValueOnce(
      mockData
    );

    const result = await getAllProfileSkillData(devId);
    expect(result).toEqual(mockData);
    expect(ProfileDataSchema.safeParse(result[0]).success).toBe(true);
  });

  it("throws an error on invalid response", async () => {
    const invalidData = [
      {
        username: "vegeta",
        skillData: [
          {
            skill: "Questing",
            skillLevel: 40,
            // missing xp
          },
        ],
        languageData: [
          {
            language: "Python",
            languageLevel: 40,
            languageXp: 60000,
          },
        ],
        // missing devId
      },
    ];

    vi.mocked(connector.fetchAllProfileSkillData).mockResolvedValueOnce(
      invalidData
    );

    await expect(() => getAllProfileSkillData(devId)).rejects.toThrow(
      "Invalid skill data received from backend"
    );
  });
});
