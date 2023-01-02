import { Publisher, PaymentCreatedEvent, Subjects } from "@fvhtickets/common"

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
