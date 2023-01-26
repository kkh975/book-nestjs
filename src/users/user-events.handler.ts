import { IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { UserCreatedEvent } from './domain/user-created.event';

export class UserEventHandler implements IEventHandler<UserCreatedEvent> {
  constructor(private emailServise: EmailService) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent!');
        const { email, signupVerifyToken } = event;
        await this.emailServise.sendMemberJoinEmail(email, signupVerifyToken);
        break;
      }
      default:
        break;
    }
  }
}
