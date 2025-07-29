// service/questRewardService.ts
import { computed, type ComputedRef, type Ref } from "vue";

export const PLATFORM_FEE_PERCENT = 2.5;

// Rounds up to 2 decimal places
export const roundUpTo2DP = (value: number): number => {
  return Math.ceil(value * 100) / 100;
};


export function timeFeeCalculations(
  timeRewardAmount: Ref<number>,
  completionRewardAmount: Ref<number>,
  platformFeePercent: number
) {
  
  const timeOnlyFee: ComputedRef = computed(() =>
    timeRewardAmount.value
      ? roundUpTo2DP(timeRewardAmount.value * (platformFeePercent / 100))
      : 0
  );

  const completionOnlyFee: ComputedRef = computed(() =>
    completionRewardAmount.value
      ? roundUpTo2DP(completionRewardAmount.value * (platformFeePercent / 100))
      : 0
  );

  const timeAndCompletionFee: ComputedRef = computed(() => {
    const total = timeRewardAmount.value + completionRewardAmount.value;
    return total ? roundUpTo2DP(total * (platformFeePercent / 100)) : 0;
  });

  const totalToPay: ComputedRef = computed(() => {
    const devReward = timeRewardAmount.value + completionRewardAmount.value;
    const fee = timeAndCompletionFee.value;
    return devReward ? roundUpTo2DP(devReward + fee) : 0;
  });

  return {
    timeOnlyFee,
    completionOnlyFee,
    timeAndCompletionFee,
    totalToPay,
  };
}


export const accordionItems = [
  {
    value: 'item-1',
    title: 'How are rewards handled?',
    content: 'You can add a monetary reward to the quest. There will also be a platform fee of 2.5%.',
  },
  {
    value: 'item-2',
    title: 'What about Stripe fees?',
    content: 'Stripe also charges a fee for handling the payment securely.',
  },
  {
    value: 'item-3',
    title: 'Can I change the reward?',
    content: 'You cannot change or update the reward once the quest has been accepted by a developer.',
  },
  {
    value: 'item-4',
    title: 'When is payment made?',
    content: 'Payment will only be made when the quest is in review and you are happy to make payment. You can choose to pay either or both of these amounts to the developer',
  },
  {
    value: 'item-5',
    title: 'What is time reward?',
    content: 'This is amount you may pay to the developer for the time spend working on the quest',
  },
  {
    value: 'item-6',
    title: 'What is completion reward?',
    content: 'This is amount you may pay to the developer for completing the quest.',
  },
  {
    value: 'item-7',
    title: 'What is tracked?',
    content: 'We will track how often you payout for work being done. Combined with other metrics this is to help the community in determine trustworthiness and reliability. If the work is not being completed or your payout score is low this my hurt your reputation as a client. We suggest creating work and quests in achievable, smaller deliverable units.',
  },
]