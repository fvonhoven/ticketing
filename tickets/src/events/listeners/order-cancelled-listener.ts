import { Listener, Subjects, OrderCancelledEvent } from "@fvhtickets/common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/ticket"
import { queueGroupName } from "./queue-group-name"
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket throw error
    if (!ticket) {
      throw new Error("Ticket not found!")
    }

    // Mark ticket as reserved by setting orderId prop
    ticket.set({ orderId: undefined })

    // Save the ticket
    await ticket.save()
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    // ack the msg
    msg.ack()
  }
}
