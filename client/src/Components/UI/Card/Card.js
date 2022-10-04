import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "./Card.css";

function ProductCard(props) {
  const { _id, title, imageUrl, price, description } = props.productInfo;

  return (
    <Card>
      <Card.Img
        variant="top"
        src={"http://localhost:3000/" + imageUrl.replace("\\", "/")}
      />
      <Card.Body>
        <Card.Title style={{ fontWeight: 600 }}>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Card.Text>${price}</Card.Text>

        {props.isAdmin && (
          <div>
            <Button variant="warning" onClick={props.onEditProduct}>
              Edit
            </Button>
            <Button variant="danger" onClick={props.onDeleteProduct}>
              Delete
            </Button>
          </div>
        )}
        {!props.isAdmin && (
          <div>
            <Link to={`/product/${_id}`} className="btn btn-primary mr-2">
              Details
            </Link>
            {props.Auth && (
              <Button onClick={props.HandleCart} className="btn btn-warning">
                Add To Cart
              </Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
