import { User } from "../../domain/models/user.model";
import { UserDTO } from "../dtos/user-dto";

export class UserMapper {
  static fromDtoToDomain(dto: UserDTO): User {
    return User.create(dto.id, dto.email, dto.name);
  }
}
