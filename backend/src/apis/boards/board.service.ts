import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '../users/entites/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findBoardAll({ page }) {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardsCreatedAt({ page, sortBy }) {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user'],
      order: { createdAt: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardsLikeCount({ page, sortBy }) {
    return await this.boardRepository.find({
      relations: ['tags', 'comment', 'images', 'user'],
      order: { likeCount: sortBy },
      take: 10,
      skip: page ? (page - 1) * 10 : 0,
    });
  }

  async findBoardOne({ boardId }) {
    return await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['tags', 'comment', 'images', 'user'],
    });
  }

  async create({ userId, createBoardInput }) {
    const { tags, image, ...Board } = createBoardInput;

    const user = await this.userRepository.find({
      where: { id: userId },
    });
    console.log(user);

    const boardtag = [];
    for (let i = 0; i < tags.length; i++) {
      const tagName = tags[i].replace('#', '');

      const prevTag = await this.tagRepository.findOne({
        where: { name: tagName },
      });

      if (prevTag) {
        boardtag.push(prevTag);
      } else {
        const newTag = await this.tagRepository.save({
          name: tagName,
        });
        boardtag.push(newTag);
      }
    }
    const result = await this.boardRepository.save({
      ...Board,
      tags: boardtag,
      userId: userId,
    });

    if (image) {
      await Promise.all(
        image.map(
          (el) =>
            new Promise((resolve, reject) => {
              this.imageRepository.save({
                url: el,
                board: { id: result.id },
              });
              resolve('이미지 저장 완료');
              reject('이미지 저장 실패');
            }),
        ),
      );

      const imageresult = await this.imageRepository.save({
        url: image,
        board: { id: result.id },
      });
      console.log(imageresult);
    }

    return result;
  }

  async update({ boardId, updateBoardInput }) {
    const { image, ...Board } = updateBoardInput;

    const boardList = await this.boardRepository.findOne({
      where: { id: boardId },
    });

    const _image = await this.imageRepository.find({
      where: { id: Board.id },
    });

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.imageRepository.softDelete({ id: el.id });
            resolve('이미지 삭제 완료');
          }),
      ),
    );

    await Promise.all(
      _image.map(
        (el) =>
          new Promise((resolve) => {
            this.imageRepository.save({
              url: el.url,
              board: { id: boardList.id },
            });
            resolve('이미지 저장 완료');
          }),
      ),
    );

    const result = this.boardRepository.save({
      ...boardList,
      id: boardId,
      ...updateBoardInput,
    });
    return result;
  }

  async delete({ boardId }) {
    const deleteresult = await this.boardRepository.softDelete({
      id: boardId,
    });
    return deleteresult.affected ? true : false;
  }

  async WithBoardDelete() {
    return await this.boardRepository.find({
      relations: ['boardTag', 'favoritBoard', 'Comment'],
      withDeleted: true,
    });
  }

  async restore({ boardId }) {
    const restoreResult = await this.boardRepository.restore({ id: boardId });
    return restoreResult.affected ? true : false;
  }
}
