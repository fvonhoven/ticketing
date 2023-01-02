import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { ExpirationCompleteEvent, OrderStatus } from "@fvhtickets/common"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"
import { Order } from "../../../models/order"

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  // Create a new ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  })
  await ticket.save()

  // Create an order
  const order = Order.build({
    status: OrderStatus.Created,
    userId: "asdf",
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, order, ticket, msg }
}

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("emits an OrderCancelled event", async () => {
  const { listener, data, order, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(eventData.id).toEqual(order.id)
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
