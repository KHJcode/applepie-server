import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Recipe } from './entity/recipe.entity';
import { IStatusResponse } from '../types/response';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { SUCCESS_RESPONSE } from '../utils/success-response';
import { RECIPE_GET_SELECT, RECIPE_LIST_SELECT } from '../utils/data-select';
import { RecipePreference } from './entity/recipe-preference.entity';
import { RecipeIncludePreference } from './interface/recipe-include-preference.interface';
import { RequestRecipePreferenceDto } from './dto/request-recipe-preference.dto';
import { LIST_WHERE_OPTION } from '../utils/list-where-option';

const RECIPE_LIST_STEP_POINT = 150;
const RECIPE_LIST_OPTION: FindManyOptions<Recipe> = {
  take: RECIPE_LIST_STEP_POINT,
  select: RECIPE_LIST_SELECT,
  order: {
    id: 'DESC',
  },
};

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe) private recipeRepository: Repository<Recipe>,
    @InjectRepository(RecipePreference)
    private recipePreferenceRepository: Repository<RecipePreference>,
  ) {}

  async getRecipes({ start, keyword, category }): Promise<Recipe[]> {
    const recipes = await this.recipeRepository.find({
      where: {
        ...(keyword ? { name: Like(`%${keyword}%`) } : {}),
        ...(category ? { category } : {}),
        ...LIST_WHERE_OPTION(start),
      },
      order: {
        id: 'DESC',
      },
      ...RECIPE_LIST_OPTION,
    });
    return await this.recipePreferenceListPipeline(recipes);
  }

  async getRecipesByUserId(id: string): Promise<Recipe[]> {
    const recipes = await this.recipeRepository.find({
      where: { user: { id } },
      select: RECIPE_LIST_SELECT,
      order: {
        id: 'DESC',
      },
    });
    return await this.recipePreferenceListPipeline(recipes);
  }

  async getPreferenceCountByRecipeId(id: number): Promise<number> {
    return await this.recipePreferenceRepository.count({
      where: { recipe: { id } },
    });
  }

  async getCountOfRecipe(): Promise<number> {
    return await this.recipeRepository.count();
  }

  async getRecipeById(id: number): Promise<RecipeIncludePreference> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      select: ['user', ...RECIPE_GET_SELECT],
      relations: ['user'],
    });
    return await this.recipePreferencePipeline(recipe);
  }

  private async recipePreferencePipeline(
    recipe: Recipe,
  ): Promise<RecipeIncludePreference> {
    const preference = await this.getPreferenceCountByRecipeId(recipe.id);
    return { preference, ...recipe } as any;
  }

  private async recipePreferenceListPipeline(
    recipeArray: Recipe[],
  ): Promise<RecipeIncludePreference[]> {
    const resultArray = [];
    if (recipeArray.length) {
      for (let idx = 0; idx < recipeArray.length; idx++) {
        const recipe = await this.recipePreferencePipeline(recipeArray[idx]);
        resultArray.push(recipe);
      }
    }
    return resultArray;
  }

  async createRecipe({
    userId,
    ...createRecipeDto
  }: CreateRecipeDto): Promise<IStatusResponse> {
    try {
      const newRecipe = await this.recipeRepository.create({
        user: { id: userId },
        ...createRecipeDto,
      });
      await this.recipeRepository.save(newRecipe);
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteRecipe(id: number): Promise<IStatusResponse> {
    try {
      await this.recipeRepository.delete({ id });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    return SUCCESS_RESPONSE;
  }

  // Preference

  async getPreferenceByRecipeIdAndUserId({
    recipeId,
    userId,
  }): Promise<RecipePreference> {
    return await this.recipePreferenceRepository.findOne({
      where: {
        recipe: recipeId,
        user: userId,
      },
      select: ['id'],
    });
  }

  async createRecipePreference(
    createRecipePreferenceDto: RequestRecipePreferenceDto,
  ): Promise<IStatusResponse> {
    try {
      const recipePreferenceIsExist =
        !!(await this.getPreferenceByRecipeIdAndUserId(
          createRecipePreferenceDto,
        ));
      if (!recipePreferenceIsExist) {
        const { userId, recipeId } = createRecipePreferenceDto;
        const newRecipePreference =
          await this.recipePreferenceRepository.create({
            user: { id: userId },
            recipe: { id: recipeId },
          });
        await this.recipePreferenceRepository.save(newRecipePreference);
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    return SUCCESS_RESPONSE;
  }

  async deleteRecipePreference(
    deleteRecipePreferenceDto: RequestRecipePreferenceDto,
  ): Promise<IStatusResponse> {
    try {
      const id = (
        await this.getPreferenceByRecipeIdAndUserId(deleteRecipePreferenceDto)
      )?.id;
      if (id) {
        await this.recipePreferenceRepository.delete({ id });
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    return SUCCESS_RESPONSE;
  }
}
