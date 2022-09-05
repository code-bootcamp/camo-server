import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String)
  address: string;

  @Field(() => [String])
  tag: string[];

  @Field(() => [String], { nullable: true })
  image: string[];
}
