import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCafeOwnerInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  phoneNumber: string;

  @Field(() => String)
  cafeName: string;
}
