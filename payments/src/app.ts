import express from "express"
import "express-async-errors"
import { json } from "body-parser"
import cookieSession from "cookie-session"
import { errorHandler, NotFoundError, currentUser } from "@fvhtickets/common"
import { createChargeRouter } from "./routes/new"

console.log("Payments service starting...!")
const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false, // process.env.NODE_ENV !== "test",
  }),
)
app.use(currentUser)

app.use(createChargeRouter)

app.all("*", () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
