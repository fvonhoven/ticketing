import "bootstrap/dist/css/bootstrap.css"
import { Suspense } from "react"
import buildClient from "../api/build-client"
import Header from "../components/header"

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <Suspense>
      <div>
        <Header currentUser={currentUser} />
        <div className="container">
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
    </Suspense>
  )
}

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get("/api/users/currentuser")

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
  }

  return {
    pageProps,
    ...data,
  }
}

export default AppComponent
