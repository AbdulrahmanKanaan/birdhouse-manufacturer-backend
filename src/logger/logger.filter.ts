import * as winston from 'winston';

export const onlyBirdActions = winston.format((info) => {
  if (info.context !== 'BIRD ACTION') {
    return false;
  }
  return info;
});
