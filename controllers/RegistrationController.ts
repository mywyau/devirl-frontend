import { registerUserRequest } from "@/connectors/RegistrationConnector";
import {
  RegistrationPayloadSchema,
  type RegistrationPayload,
} from "@/types/schema/UserDataSchema";
import { z } from "zod";

export async function submitRegisterUser(
  userId: string | undefined,
  form: {
    username: string;
    firstName: string;
    lastName: string;
    userType: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!userId) {
    return {
      success: false,
      error: "User ID is missing. Please log in again.",
    };
  }

  try {
    const payload: RegistrationPayload = RegistrationPayloadSchema.parse(form);
    await registerUserRequest(userId, payload);

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
