import { updateUserType } from "@/connectors/RegistrationConnector";
import {
  UpdateUserTypeSchema,
  type UpdateUserType,
} from "@/types/schema/UserDataSchema";
import { z } from "zod";

export async function submitUserTypeUpdate(
  userId: string | undefined,
  form: { username: string; userType: string }
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return {
      success: false,
      error: "User ID is missing. Please log in again.",
    };
  }

  try {
    const payload: UpdateUserType = UpdateUserTypeSchema.parse(form);
    await updateUserType(userId, payload);

    await $fetch("/api/auth/refresh-session", {
      method: "POST",
      credentials: "include",
    });

    return { success: true };
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return {
        success: false,
        error: e.errors.map((err) => err.message).join(", "),
      };
    }

    return {
      success: false,
      error: e?.data?.message || "Something went wrong",
    };
  }
}
