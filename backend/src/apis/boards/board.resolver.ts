import { UnprocessableEntityException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { BoardsService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class Boardsresolver {
  constructor(
    private readonly boardsService: BoardsService, //

    private readonly usersService: UsersService,
  ) {}

  // 전체 게시글 조회
  @Query(() => [Board])
  fetchBoards() {
    return this.boardsService.findBoardAll();
  }

  // 원하는 게시글 조회 (엘라스틱서치 추가)
  @Query(() => Board)
  fetchBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.findBoardOne({ boardId });
  }

  // 삭제된 게시글 조회
  @Query(() => [Board])
  fetchBoardWithDeleted() {
    return this.boardsService.WithBoardDelete();
  }

  // 게시글 생성 (존맛탱 추가)
  @Mutation(() => Board)
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
  ) {
    return this.boardsService.create({ createBoardInput });
  }

  // 게시글 수정 (존맛탱 추가)
  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('userId') userId: string, //
    @Args('email') email: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    const board = await this.boardsService.findBoardOne({ boardId });

    if (!board)
      throw new UnprocessableEntityException('등록된 게시글이 없습니다.');

    const user = await this.usersService.findOne({ userId });
    if (!user)
      throw new UnprocessableEntityException(`${email}님의 게시글이 아닙니다.`);

    return this.boardsService.update({ boardId, updateBoardInput });
  }

  // 게시글 삭제 (존맛탱 추가)
  @Mutation(() => Boolean)
  deleteBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.boardsService.delete({ boardId });
  }
}
