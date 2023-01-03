import express from "express"
import "express-async-errors"
import { json } from "body-parser"
import cookieSession from "cookie-session"
import { errorHandler, NotFoundError, currentUser } from "@fvhtickets/common"
import { deleteOrderRouter } from "./routes/delete"
import { indexOrderRouter } from "./routes/index"
import { newOrderRouter } from "./routes/new"
import { showOrderRouter } from "./routes/show"

const app = express()
app.set("trust proxy", true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false // process.env.NODE_ENV !== "test",
  }),
)
app.use(currentUser)

app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)

app.all("*", () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
2314E1980748B5CDE73E939A713C6AB0.F4FA39DFCCC9667DBFD3BE8DE48E7490.63b4628fb72d5.comodoca.com