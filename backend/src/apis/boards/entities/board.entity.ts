import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { Comment } from 'src/apis/comments/entites/comment.entity';
import { favoriteBoard } from 'src/apis/favoriteBoard/entities/favoriteBoard.entity';
import { Image } from 'src/apis/images/entities/image.entity';
import { BoardTag } from 'src/apis/tags/entities/tag.entity';
import { User } from 'src/apis/users/entites/user.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  DeleteDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => String)
  adress: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  likeCount: string;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @JoinTable()
  @ManyToMany(() => BoardTag, (boardTag) => boardTag.board, { nullable: true })
  @Field(() => [BoardTag], { nullable: true })
  tag: BoardTag[];

  @JoinTable()
  @ManyToMany(
    () => favoriteBoard,
    (favoriteBoard) => favoriteBoard.board,
    { nullable: true }, //
  )
  @Field(() => [favoriteBoard], { nullable: true })
  favoriteBoard: favoriteBoard[];

  @JoinTable()
  @ManyToMany(() => Comment, (comment) => comment.board, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comment: Comment[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @JoinColumn()
  @OneToOne(() => CafeList, { nullable: true })
  @Field(() => CafeList, { nullable: true })
  cafeList: CafeList;

  @OneToMany(() => Image, (image) => image.board)
  @Field(() => [Image])
  image: Image[];
}