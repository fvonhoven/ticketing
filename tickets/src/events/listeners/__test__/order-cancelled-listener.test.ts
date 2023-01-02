import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCancelledEvent, OrderStatus } from "@fvhtickets/common"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: "concert",
    price: 99,
    userId: "123",
  })
  ticket.set({ orderId })
  await ticket.save()

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, data, msg, orderId }
}

it("unsets the orderId property on the ticket", async () => {
  const { listener, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined()
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it("publishes a ticket cancelled event", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
