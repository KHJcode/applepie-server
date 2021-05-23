import { IsMobilePhone, IsNumberString, IsString, Length, MaxLength, MinLength } from "class-validator";

export class SaveVerifyUserDto {

  @MinLength(7)
  @MaxLength(15)
  @IsMobilePhone()
  @IsString()
  readonly phone: string;

  @MaxLength(150)
  @IsString()
  readonly password: string;

  @Length(6)
  @IsNumberString()
  readonly verifyNumber: string;
}
