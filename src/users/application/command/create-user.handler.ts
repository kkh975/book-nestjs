import { ICommandHandler } from '@nestjs/cqrs';

export class CreateUserHandler implements ICommandHandler<CreateUserHandler> {
  execute(command: CreateUserHandler): Promise<any> {}
}
