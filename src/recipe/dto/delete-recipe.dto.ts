import { IntersectionType } from '@nestjs/mapped-types';
import { RecipeIdDto } from './recipe-id.dto';
import { OptionalUserIdDto } from './optional-user-id.dto';

export class DeleteRecipeDto extends IntersectionType(
  RecipeIdDto,
  OptionalUserIdDto,
) {}
