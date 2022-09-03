import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entites/user.entity';

@Entity()
@ObjectType()
export class favoriteBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToMany(() => Board, (board) => board.favoriteBoard)
  @Field(() => Board)
  board: Board;
}
