import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { RecipePreference } from './recipe-preference.entity';

@Entity('recipes')
export class Recipe extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 20, nullable: false })
  name: string;

  @Column({ length: 200, nullable: true })
  thumbnail: string;

  @Column('text', { nullable: true })
  image: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column('text', { nullable: false })
  ingredients: string;

  @Column('text', { nullable: false })
  contents: string;

  @Column('tinyint', { nullable: false })
  category: number;

  @Column('boolean', { nullable: false, default: false })
  useOven: boolean;

  @Column('int', { nullable: false })
  time: number;

  @ManyToOne((type) => User, (user: User) => user.recipes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    (type) => RecipePreference,
    (recipe_preference: RecipePreference) => recipe_preference.recipe,
    {
      cascade: true,
    },
  )
  recipe_preferences: RecipePreference[];

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedDate: Date;
}
