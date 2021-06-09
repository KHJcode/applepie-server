import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { StatusResponse } from '../types/status-response';
import { SUCCESS_RESPONSE } from '../utils/success-response';
import { POST_GET_SELECT, POST_LIST_SELECT } from '../utils/data-select';
import {
  selectUserListPipeline,
  selectUserPipeline,
} from '../utils/select-user-pipeline';

const POST_LIST_STEP_POINT = 15;
const POST_LIST_OPTION = (step: number): FindManyOptions<Post> => ({
  skip: POST_LIST_STEP_POINT * (step - 1),
  take: POST_LIST_STEP_POINT * step,
});

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async getPostList(step: number): Promise<Post[]> {
    return await this.postRepository.find({
      ...POST_LIST_OPTION(step),
      select: POST_LIST_SELECT,
    });
  }

  async getPostListIncludeUser(step: number): Promise<Post[]> {
    const data = await this.postRepository.find({
      ...POST_LIST_OPTION(step),
      select: ['user', ...POST_LIST_SELECT],
      relations: ['user'],
    });
    return selectUserListPipeline(data);
  }

  async getPostById(id: string): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      select: POST_GET_SELECT,
    });
  }

  async getPostIncludeUserById(userId: string): Promise<Post> {
    const data = await this.postRepository.findOne({
      where: { id: userId },
      select: ['user', ...POST_GET_SELECT],
      relations: ['user'],
    });
    return selectUserPipeline(data);
  }

  async createPost({
    userId,
    ...createPostDto
  }: CreatePostDto): Promise<StatusResponse> {
    try {
      const newPost = await this.postRepository.create({
        user: { id: userId },
        ...createPostDto,
      });
      await this.postRepository.save(newPost);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    return SUCCESS_RESPONSE;
  }

  async deletePost(id: string): Promise<StatusResponse> {
    try {
      await this.postRepository.delete({ id });
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
    return SUCCESS_RESPONSE;
  }
}
