import { Publisher, OrderCancelledEvent, Subjects } from "@fvhtickets/common"

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
