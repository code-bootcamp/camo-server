import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FreeBoard } from '../../freeboards/entities/freeBoard.entity';
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

  @ManyToOne(() => User, { nullable: true })
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => FreeBoard, { nullable: true })
  @Field(() => FreeBoard, { nullable: true })
  freeBoard: FreeBoard;
}
