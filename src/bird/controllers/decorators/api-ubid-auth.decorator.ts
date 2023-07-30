import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiUbidAuth() {
  return applyDecorators(
    ApiHeader({
      name: 'X-UBID',
      description:
        'Authentication header, you can add multiple UBIDs using comma separated values',
      required: true,
    }),
  );
}
