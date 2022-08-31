import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  reviewComment: string;

  @Column()
  @Field(() => String)
  reviewPoint: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  ownerComment: string;
}
