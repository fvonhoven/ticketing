import Link from "next/link"
import Nav from "react-bootstrap/Nav"
import Image from "next/image"
// import logo from "/tix.png"

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
      return (
        <Nav.Item className="navbar">
          <Nav.Link className="nav-link" eventKey={href} href={href}>
            {label}
          </Nav.Link>
        </Nav.Item>
      )
      return (
        <li key={href}>
          <Link className="navbar" href={href}>
            <span className="nav-link">{label}</span>
          </Link>
        </li>
      )
    })
  // return (
  //   <nav className="navbar navbar-dark bg-dark">
  //     <Link className="navbar-brand" href="/">
  //       <div className="navbar-brand">TicketZone</div>
  //     </Link>
  //     <div className="d-flex">
  //       <ul className="nav d-flex align-items-center">{links}</ul>
  //     </div>
  //   </nav>
  // )
  return (
    <Nav className="navbar" activeKey="/home" style={{ backgroundColor: "#F4AD53", height: 80, padding: 0 }}>
      <Nav.Item>
        <Nav.Link href="/">
          <Image src="/banner-logo.jpg" alt="banner-logo" width="300" height="70" />
        </Nav.Link>
      </Nav.Item>
      <div className="d-flex">{links}</div>
    </Nav>
  )
}
