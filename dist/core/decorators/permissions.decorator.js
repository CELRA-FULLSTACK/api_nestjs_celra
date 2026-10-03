import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../../configs/constants.js';
export const RequirePermissions = (...permissions) => SetMetadata(PERMISSIONS_KEY, permissions);
//# sourceMappingURL=permissions.decorator.js.map