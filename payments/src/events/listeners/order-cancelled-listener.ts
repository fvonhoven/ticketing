import { Listener, Subjects, OrderCancelledEvent, OrderStatus } from "@fvhtickets/common"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { queueGroupName } from "./queue-group-name"

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket that the order is reserving
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })

    // If no ticket throw error
    if (!order) {
      throw new Error("Order not found!")
    }

    // Mark ticket as reserved by setting orderId prop
    order.set({ status: OrderStatus.Cancelled })

    // Save the ticket
    await order.save()

    // ack the msg
    msg.ack()
  }
}
