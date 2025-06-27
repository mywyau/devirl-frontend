import { beforeEach, describe, expect, it, vi } from "vitest";
import * as connector from "../../connectors/LanguageConnector";
import {
    getHiscoreLanguage,
    getLanguage,
} from "../../controllers/LanguageController";

import { LanguageDataSchema } from "../../types/schema/LangaugeSchema";

vi.mock("@/connectors/LanguageConnector", () => ({
  fetchLanguage: vi.fn(),
  fetchHiscoreLanguage: vi.fn(),
}));

describe("LanguageController", () => {
  const devId = "dev123";
  const username = "goku";
  const language = "TypeScript";
  const level = 55;
  const xp = 100000;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getLanguage", () => {
    it("should return parsed language data on success", async () => {
      const mockData = {
        devId: "dev123",
        username: "goku",
        language: "Python",
        level: 55,
        xp: 100000,
      };

      vi.mocked(connector.fetchLanguage).mockResolvedValueOnce(mockData);

      const result = await getLanguage(devId, language);

      expect(result).toEqual(mockData);
      expect(connector.fetchLanguage).toHaveBeenCalledWith(
        devId,
        language,
        undefined
      );

      // Validate with Zod to be extra sure it's a good test
      expect(LanguageDataSchema.safeParse(result).success).toBe(true);
    });

    it("should throw an error if schema validation fails", async () => {
      const invalidData = {
        username: "dev123",
        comment: "missing rank",
      };

      vi.mocked(connector.fetchLanguage).mockResolvedValueOnce(invalidData);

      await expect(() => getLanguage(devId, language)).rejects.toThrow(
        "Invalid language data received from backend"
      );
    });
  });

  describe("getHiscoreLanguage", () => {
    it("should return parsed array of language data on success", async () => {
      const mockData = [
        {
          devId: "dev123",
          username: "goku",
          language: "Python",
          level: 55,
          xp: 100000,
        },
        {
          devId: "dev12345",
          username: "vegeta",
          language: "Rust",
          level: 30,
          xp: 30000,
        },
      ];

      vi.mocked(connector.fetchHiscoreLanguage).mockResolvedValueOnce(mockData);

      const result = await getHiscoreLanguage(language);

      expect(result).toEqual(mockData);
      expect(connector.fetchHiscoreLanguage).toHaveBeenCalledWith(
        language,
        undefined
      );
    });

    it("should throw an error if hiscore response is invalid", async () => {
      const invalidData = [
        {
          username: "devX",
          comment: "missing rank again",
        },
      ];

      vi.mocked(connector.fetchHiscoreLanguage).mockResolvedValueOnce(
        invalidData
      );

      await expect(() => getHiscoreLanguage(language)).rejects.toThrow(
        "Invalid language data received from backend"
      );
    });
  });
});
