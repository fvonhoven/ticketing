import { Publisher, OrderCreatedEvent, Subjects } from "@fvhtickets/common"

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
