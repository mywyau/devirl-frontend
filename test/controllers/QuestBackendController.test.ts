// test/controllers/QuestBackendController.test.ts
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { QuestBackendController } from '@/controllers/QuestBackendController'
import type { CreateQuestPayload, QuestPartial } from '@/types/quests'
import type { CreatedResponse } from '@/types/apiResponses'

// ✅ Mock useFetch globally
vi.mock('nuxt/app', () => ({
  useFetch: vi.fn()
}))

import { useFetch } from 'nuxt/app'

const mockConfig = {
  devQuestBackend: {
    baseUrl: 'https://api.devirl.com'
  }
}

// You can inline the controller setup if using the real ConfigLoader isn't needed
describe('QuestBackendController', () => {
  let controller: QuestBackendController

  beforeEach(() => {
    controller = new QuestBackendController({ devQuestBackend: mockConfig.devQuestBackend })
    vi.resetAllMocks()
  })

  it('returns quest data on getQuest()', async () => {
    const mockQuest: QuestPartial = {
      userId: 'u123',
      questId: 'q123',
      title: 'Defeat the goblin',
      description: 'A goblin in the woods',
      status: 'NotStarted'
    }

    ;(useFetch as vi.Mock).mockResolvedValue({
      data: { value: mockQuest },
      error: { value: null }
    })

    const result = await controller.getQuest('q123')
    expect(result).toEqual(mockQuest)
    expect(useFetch).toHaveBeenCalledWith('https://api.devirl.com/dev-quest-service/quest/q123', {
      credentials: 'include'
    })
  })

  it('throws if getQuest() returns an error', async () => {
    const mockError = new Error('Not Found')
    ;(useFetch as vi.Mock).mockResolvedValue({
      data: { value: null },
      error: { value: mockError }
    })

    await expect(controller.getQuest('bad-id')).rejects.toThrow('Not Found')
  })

  it('posts quest data on createQuest()', async () => {
    const payload: CreateQuestPayload = {
      userId: 'u1',
      questId: 'q1',
      title: 'Test Quest',
      description: 'Test description',
      status: 'InProgress'
    }

    const mockResponse: CreatedResponse = {
      id: 'q1',
      created: true
    }

    ;(useFetch as vi.Mock).mockResolvedValue({
      data: { value: mockResponse },
      error: { value: null }
    })

    const result = await controller.createQuest(payload)
    expect(result).toEqual(mockResponse)
    expect(useFetch).toHaveBeenCalledWith('https://api.devirl.com/dev-quest-service/quest/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    })
  })

  it('throws if createQuest() fails', async () => {
    const payload: CreateQuestPayload = {
      userId: 'u2',
      questId: 'q2',
      title: 'Fail Quest',
      description: 'Will fail',
      status: 'Completed'
    }

    const mockError = new Error('Server Error')
    ;(useFetch as vi.Mock).mockResolvedValue({
      data: { value: null },
      error: { value: mockError }
    })

    await expect(controller.createQuest(payload)).rejects.toThrow('Server Error')
  })
})
