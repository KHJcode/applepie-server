import {
  IsMobilePhone,
  IsNumberString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyUserDto {
  @MinLength(7)
  @MaxLength(15)
  @IsMobilePhone()
  phone: string;

  @Length(6)
  @IsNumberString()
  verifyNumber: string;
}
