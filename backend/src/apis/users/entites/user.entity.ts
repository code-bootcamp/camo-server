import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { USER_ROLE } from 'src/commons/type/user';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

registerEnumType(USER_ROLE, {
  name: 'USER_ROLE_ENUM',
});

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

  @Column({ nullable: true }) // 소셜 로그인 때문에
  @Field(() => String, { nullable: true })
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

  @Column({ type: 'enum', enum: USER_ROLE, nullable: true })
  @Field(() => USER_ROLE, { nullable: true })
  role: string;
}
