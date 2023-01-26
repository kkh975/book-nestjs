import { EventBus } from '@nestjs/cqrs';
import { User } from './user';
import { UserCreatedEvent } from './user-created.event';

export class UserFactory {
  constructor(private eventBus: EventBus) {}

  create(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ) {
    const user = new User(id, name, email, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));

    return user;
  }

  reconstitute(id, name, email, signupVerifyToken, password) {
    return Promise.resolve(
      new User(id, name, email, signupVerifyToken, password),
    );
  }
}
