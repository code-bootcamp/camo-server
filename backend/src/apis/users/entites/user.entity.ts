import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/apis/comments/entites/comment.entity';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  phoneNumber: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  nickName: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  cafeName: string;

  @CreateDateColumn()
  @Field(() => Date)
  signupDate: Date;

  @DeleteDateColumn({ nullable: true })
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  favoritCafe: string;

  @JoinTable()
  @ManyToMany(() => Comment, (comment) => comment.user, { nullable: true })
  @Field(() => [Comment], { nullable: true })
  comment: Comment[];

  // @OneToMany(
  //   () => favoriteBoard,
  //   (favoriteBoard) => favoriteBoard.board,
  //   { nullable: true }, //
  // )
  // @Field(() => [favoriteBoard], { nullable: true })
  // favoriteBoard: favoriteBoard[];
}
