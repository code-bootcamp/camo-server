import { Field } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entites/user.entity';

@Entity()
export class favoriteBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
