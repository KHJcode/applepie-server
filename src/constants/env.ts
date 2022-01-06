export const ENV_PATH = `env/${
  process.env.NODE_ENV === 'development'
    ? 'dev'
    : process.env.NODE_ENV === 'test'
      ? 'test'
      : 'prod'
}.env`;
