import { User } from '../user/entity/user.entity';
import { Post } from '../post/entity/post.entity';
import { Comment } from '../comment/entity/comment.entity';
import { Recipe } from '../recipe/entity/recipe.entity';
import { RecipePreference } from '../recipe/entity/recipe-preference.entity';
import { PostPreference } from '../post/entity/post-preference.entity';

export const entities = [
  User,
  Post,
  Comment,
  Recipe,
  RecipePreference,
  PostPreference,
];
