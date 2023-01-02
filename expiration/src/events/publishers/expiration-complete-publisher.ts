import { Subjects, Publisher, ExpirationCompleteEvent } from "@fvhtickets/common"

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
