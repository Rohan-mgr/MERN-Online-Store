import "./NavBar.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useLocation } from "react-router-dom";

function NavBar(props) {
  const location = useLocation();
  return (
    <Navbar bg="Navbar" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            alt="shopping cart"
            src="/dist/img/shopping-cart.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          ONLINE STORE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
          style={{ width: "100%" }}
        >
          <Nav
            activeKey={location.pathname}
            className="text-center"
            style={{ marginLeft: "auto" }}
          >
            <Nav.Link href="/" className="mx-3 my-2">
              Shop
            </Nav.Link>
            <Nav.Link href="/product" className="mx-3 my-2">
              Product
            </Nav.Link>
            {props.isAuth && (
              <>
                <Nav.Link href="/cart" className="mx-3 my-2">
                  Cart
                </Nav.Link>
                <Nav.Link href="/orders" className="mx-3 my-2">
                  Orders
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav
            activeKey={location.pathname}
            className="text-center"
            style={{ marginLeft: "auto" }}
          >
            {!props.token ? (
              <Nav.Link
                href="/login"
                className="mx-3 my-2"
                style={{ marginLeft: "auto" }}
              >
                Login
              </Nav.Link>
            ) : (
              <button onClick={props.onLogout}>Logout</button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
