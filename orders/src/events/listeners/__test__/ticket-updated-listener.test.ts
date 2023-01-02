import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { TicketUpdatedEvent } from "@fvhtickets/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // Create and save a ticket
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  })
  await ticket.save()

  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "asdf",
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, ticket }
}

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure a ticket was created
  expect(msg.ack).toHaveBeenCalled()
})

it("does not call ack if version number is out of order", async () => {
  const { listener, data, msg } = await setup()

  // set the version way ahead
  data.version = 10
  try {
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
