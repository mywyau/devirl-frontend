// import { useFetch } from '#app'

import { useFetch } from "nuxt/app";

const API_BASE = 'https://payments.devirl.com'; // 👈 replace with your Payment Service ALB DNS or domain

export const usePayments = () => {
  
  const createUpfrontPayment = async (taskId: string, amount: number, currency = 'usd') => {
    const { data, error } = await useFetch(`${API_BASE}/payments/upfront`, {
      method: 'POST',
      body: {
        task_id: taskId,
        amount,
        currency,
      },
    });

    if (error.value) {
      throw new Error('Failed to create upfront payment');
    }
    return data.value;
  };

  const createTimePayment = async (taskId: string, amount: number, currency = 'usd') => {
    const { data, error } = await useFetch(`${API_BASE}/payments/time`, {
      method: 'POST',
      body: {
        task_id: taskId,
        amount,
        currency,
      },
    });

    if (error.value) {
      throw new Error('Failed to create time-based payment');
    }
    return data.value;
  };

  const createRewardPayment = async (taskId: string, amount: number, currency = 'usd') => {
    const { data, error } = await useFetch(`${API_BASE}/payments/reward`, {
      method: 'POST',
      body: {
        task_id: taskId,
        amount,
        currency,
      },
    });

    if (error.value) {
      throw new Error('Failed to create reward payment');
    }
    return data.value;
  };

  return {
    createUpfrontPayment,
    createTimePayment,
    createRewardPayment,
  };
};
