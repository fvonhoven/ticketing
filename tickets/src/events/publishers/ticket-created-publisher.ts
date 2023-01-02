import { Publisher, Subjects, TicketCreatedEvent } from "@fvhtickets/common"

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
