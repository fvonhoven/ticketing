import axios from "axios"

export default ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: "https://www.ticketzone.online",
      // baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    })
  } else {
    return axios.create({
      baseURL: "/",
    })
  }
}
