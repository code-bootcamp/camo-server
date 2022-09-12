import { Field, InputType } from '@nestjs/graphql';
import { USER_ROLE } from 'src/commons/type/user';
import { Column } from 'typeorm';

@InputType()
export class CreateUserInput {
  @Column()
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ nullable: true }) // 소셜 로그인 때문에 nullabe : true
  @Field(() => String, { nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  nickName: string;

  @Column({ nullable: true }) // 카페사장 회원만
  @Field(() => String, { nullable: true })
  cafeName: string;

  @Column({ type: 'enum', enum: USER_ROLE, nullable: true })
  @Field(() => USER_ROLE, { nullable: true })
  role: string;

  // @JoinTable()
  // @ManyToMany(() => Comment, (comment) => comment.user, { nullable: true })
  // @Field(() => [Comment], { nullable: true })
  // comment: Comment[];

  // @OneToMany(
  //   () => favoriteBoard,
  //   (favoriteBoard) => favoriteBoard.board,
  //   { nullable: true }, //
  // )
  // @Field(() => [favoriteBoard], { nullable: true })
  // favoriteBoard: favoriteBoard[];
}
