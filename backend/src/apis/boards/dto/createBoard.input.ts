import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  zipcode: string;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  addressDetail: string;

  @Field(() => [String], { nullable: true })
  tags: string[];

  @Field(() => [String], { nullable: true })
  image: string[];

  @Field(() => String, { nullable: true })
  cafeList: string;
}
