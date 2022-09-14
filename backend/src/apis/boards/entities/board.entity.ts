import { Field, ObjectType } from '@nestjs/graphql';
import { CafeList } from 'src/apis/cafeLists/entities/cafeList.entity';
import { Comment } from 'src/apis/comments/entites/comment.entity';
import { favoriteBoard } from 'src/apis/favoriteBoard/entities/favoriteBoard.entity';
import { Image } from 'src/apis/images/entities/image.entity';
import { Tag } from 'src/apis/tags/entities/tag.entity';
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
  OneToMany,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  likeCount: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @UpdateDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  address: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  addressDetail: string;

  @JoinTable()
  @ManyToMany(() => Tag, (tags) => tags.boards, { nullable: true })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

  @OneToMany(() => favoriteBoard, (favoriteBoard) => favoriteBoard.board, {
    nullable: true,
  })
  @Field(() => [favoriteBoard], { nullable: true })
  favoriteBoard: favoriteBoard[];

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => CafeList, { nullable: true })
  @Field(() => CafeList, { nullable: true })
  cafeList: CafeList;

  @JoinTable()
  @OneToMany(() => Image, (image) => image.board, {
    nullable: true,
    cascade: true,
  })
  @Field(() => [Image], { nullable: true })
  images: Image[];

  @JoinTable()
  @OneToMany(() => Comment, (comment) => comment.board, {
    nullable: true,
    cascade: true,
  })
  @Field(() => [Comment], { nullable: true })
  comment: Comment[];
}
