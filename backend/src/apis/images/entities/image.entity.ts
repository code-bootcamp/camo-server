import { Field, ObjectType } from '@nestjs/graphql';
import { FreeBoard } from 'src/apis/freeboards/entities/freeBoard.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  isMain: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => FreeBoard, (freeBoard) => freeBoard.images)
  @Field(() => FreeBoard)
  freeBoard: FreeBoard;
}
