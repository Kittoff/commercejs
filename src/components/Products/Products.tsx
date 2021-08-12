import { Grid } from "@material-ui/core";
import React, { FC } from "react";
import Product from "./Product/Product";
import useStyles from "./styles";

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: {
    formatted_with_code: string;
  };
  media: {
    source: string;
  };
};

interface Props {
  products: ProductType[];
  onAddToCart: (productId: string, quantity: number) => void;
}

const Products: FC<Props> = ({ products, onAddToCart }) => {
  const classes = useStyles();
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Grid container justify="center" spacing={4}>
        {products.map((product: ProductType) => {
          return (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Product product={product} onAddToCart={onAddToCart} />
            </Grid>
          );
        })}
      </Grid>
    </main>
  );
};

export default Products;
