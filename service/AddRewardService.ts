// service/questRewardService.ts
import { computed, type ComputedRef, type Ref } from "vue";

// Rounds up to 2 decimal places
export const roundUpTo2DP = (value: number): number => {
  return Math.ceil(value * 100) / 100;
};

export function useQuestFeeCalculations(
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
