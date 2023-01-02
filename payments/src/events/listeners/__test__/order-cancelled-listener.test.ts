import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { OrderCancelledEvent, OrderStatus } from "@fvhtickets/common"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Order } from "../../../models/order"

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asdf",
    version: 0,
  })
  await order.save()

  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "akjashdg",
    },
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, order, msg }
}

it("updates the status of the order", async () => {
  const { listener, data, order, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("acks the message", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it.skip("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
