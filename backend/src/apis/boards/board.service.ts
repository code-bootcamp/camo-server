import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/comment.entity';
import { favoriteBoard } from '../favoriteBoard/entities/favoriteBoard.entity';
import { BoardTag } from '../tags/entities/tag.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,

    @InjectRepository(favoriteBoard)
    private readonly favoriteBoardRepository: Repository<favoriteBoard>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findBoardAll() {
    return await this.boardRepository.find({
      relations: ['tags', 'favoritBoard', 'Comment'],
    });
  }

  async findBoardOne({ boardId }) {
    return await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ['tags', 'favoritBoard', 'Comment'],
    });
  }

  async create({ createBoardInput }) {
    const { tags, ...Board } = createBoardInput;

    const boardtag = [];
    for (let i = 0; i < tags.length; i++) {
      const tagName = tags[i];

      const prevTag = await this.boardTagRepository.findOne({
        where: { name: tagName },
      });

      if (prevTag) {
        boardtag.push(prevTag);
      } else {
        const newTag = await this.boardTagRepository.save({
          name: tagName,
        });
        tags.push(newTag);
      }
    }

    const result = await this.boardRepository.save({
      ...Board,
      boardTag: tags,
    });

    return result;
  }

  async update({ boardId, updateBoardInput }) {
    const { ...Board } = updateBoardInput;

    const boardList = await this.boardRepository.findOne({
      where: { id: boardId },
    });

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
}
