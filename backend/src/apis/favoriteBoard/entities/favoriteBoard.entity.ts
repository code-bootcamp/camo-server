import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from '../../users/entites/user.entity';

@Entity()
@ObjectType()
export class favoriteBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isLike: boolean;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Board)
  @Field(() => Board)
  board: Board;
}
