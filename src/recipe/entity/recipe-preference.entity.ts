import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Recipe } from './recipe.entity';

@Entity('recipe_preferences')
export class RecipePreference extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((type) => Recipe, (recipe: Recipe) => recipe.recipe_preferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipeId' })
  recipe: Recipe;

  @ManyToOne((type) => User, (user: User) => user.recipe_preferences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedDate: Date;
}
