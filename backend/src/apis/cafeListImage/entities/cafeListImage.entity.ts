import { Field, ObjectType } from '@nestjs/graphql';
import { CafeBoard } from 'src/apis/cafeBoards/entities/cafeBoard.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CafeListImage {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  url: string;

  @Column({ nullable: true })
  @Field(() => Boolean, { nullable: true })
  isMain: boolean;

  @DeleteDateColumn({ nullable: true })
  @Field(() => String, { nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CafeBoard, {
    nullable: true,
    orphanedRowAction: 'soft-delete',
  })
  @Field(() => CafeBoard, { nullable: true })
  cafeBoard: CafeBoard;
}
