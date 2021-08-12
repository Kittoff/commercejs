import React, { FC } from "react";
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import useStyles from "./styles";

export type CartItemType = {
  id: string;
  is_valid: boolean;
  line_total: {
    formatted: string;
    formatted_with_symbol: string;
  };
  media: {
    source: string;
    type: string;
  };
  name: string;
  permalink: string;
  price: {
    formatted: string;
    formatted_with_symbol: string;
    raw: number;
  };
  product_id: string;
  product_meta: any;
  product_name: string;
  quantity: number;
  selected_options: any;
  sku: any;
  variant: any;
};
type Props = {
  item: CartItemType;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
};

const CartItem: FC<Props> = ({
  item,
  onUpdateCartQuantity,
  onRemoveFromCart,
}) => {
  const classes = useStyles();
  return (
    <Card>
      <CardMedia image={item.media.source} className={classes.media} />
      <CardContent className={classes.cardContent}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">
          {item.line_total.formatted_with_symbol}
        </Typography>
      </CardContent>
      <CardActions className={classes.cartActions}>
        <div className={classes.buttons}>
          <Button
            type="button"
            size="small"
            onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}
          >
            -
          </Button>
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          <Button
            type="button"
            size="small"
            onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button
          variant="contained"
          type="button"
          color="secondary"
          onClick={() => onRemoveFromCart(item.id)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
