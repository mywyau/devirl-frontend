export default defineEventHandler(() => {
    return {
      status: 'ok',
      message: 'Nuxt frontend is alive',
      timestamp: new Date().toISOString(),
    };
  });
  