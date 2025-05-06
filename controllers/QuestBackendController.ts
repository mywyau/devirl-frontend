// controllers/QuestBackendController.ts
import { useFetch } from 'nuxt/app'
import { ConfigLoader } from '@/configuration/ConfigLoader'
import type { CreatedResponse } from '@/types/apiResponses'
import type { CreateQuestPayload, QuestPartial } from '@/types/quests'

export class QuestBackendController {
  constructor(
    private readonly config = ConfigLoader, // ← use default
    private readonly apiBasePath = '/dev-quest-service'
  ) {}

  private get baseUrl(): string {
    return `${this.config.devQuestBackend.baseUrl}${this.apiBasePath}`
  }

  getQuestUrl(questId: string): string {
    return `${this.baseUrl}/quest/${questId}`
  }

  get createQuestUrl(): string {
    return `${this.baseUrl}/quest/create`
  }

  async getQuest(questId: string): Promise<QuestPartial | null> {
    const { data, error } = await useFetch<QuestPartial>(this.getQuestUrl(questId), {
      credentials: 'include',
    })

    if (error.value) throw error.value
    return data.value
  }

  async createQuest(payload: CreateQuestPayload): Promise<CreatedResponse | null> {
    const { data, error } = await useFetch<CreatedResponse>(this.createQuestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    })

    if (error.value) throw error.value
    return data.value
  }
}
``
