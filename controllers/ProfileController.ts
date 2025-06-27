// controllers/ProfileController.ts
import {
  fetchAllProfileSkillData,
  type FetchOptions,
} from "@/connectors/ProfileConnector";
import {
  ProfileDataSchema,
  type ProfileData,
} from "@/types/schema/ProfileDataSchema";
import { z } from "zod";

export async function getAllProfileSkillData(
  devId: string,
  opts?: FetchOptions
): Promise<ProfileData[]> {
  
  const res = await fetchAllProfileSkillData(devId, opts);

  const parsed = z.array(ProfileDataSchema).safeParse(res);
  if (!parsed.success) {
    console.error("[getSkill] Invalid skill data", parsed.error);
    throw new Error("Invalid skill data received from backend");
  }

  return parsed.data;
}
