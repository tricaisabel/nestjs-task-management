import { createParamDecorator } from '@nestjs/common';
import { User } from './user.entity';

export const getUser = createParamDecorator((_data, ctx): User => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
