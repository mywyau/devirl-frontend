// controllers/QuestBackendController.ts
import { loadConfig } from "@/configuration/ConfigLoader";
import { $fetch } from "ofetch";

const config = loadConfig();
const baseUrl = `${config.devQuestBackend.baseUrl}/`;

export const uploadUrl = () => `${baseUrl}v2/upload`;

export const getFileMetaDataUrl = (questId: string) =>
  `${baseUrl}dev/submission/file/metadata/${questId}`;

export const preSignedDownloadUrl = () => `${baseUrl}s3/presign-download`;

export async function getFileMetaData(questId: string) {

  return await $fetch(getFileMetaDataUrl(questId), {
    method: "GET",
    credentials: "include",
  });
}

export async function createPreSignedDownloadUrl(key: string) {
  return await $fetch(preSignedDownloadUrl(), {
    method: "POST",
    credentials: "include",
    body: { key }, // 👈 required payload
  });
}
