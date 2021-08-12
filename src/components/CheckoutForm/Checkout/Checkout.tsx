import React, { FC, useState, useEffect } from "react";
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";

interface Props {
  cart: any;
  order: any;
  onCaptureCheckout: any;
  error: any;
  // next: any;
  // shippingData: any;
}

const steps = ["Shipping address", "Payment details"];

const Checkout: FC<Props> = ({ cart, order, onCaptureCheckout, error }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [checkoutToken, setCheckoutToken] = useState<any>(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });

        setCheckoutToken(token);
      } catch (error) {
        history.push("/");
      }
    };

    generateToken();
  }, [cart]);

  const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const backStep = () => setActiveStep((prevStep) => prevStep - 1);

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true);
    }, 3000);
  };

  const next = (data: any) => {
    setShippingData(data);
    nextStep();
  };
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        nextStep={nextStep}
        timeout={timeout}
      />
    );

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase, {order.customer.firstname}{" "}
            {order.customer.lastname}
            <Divider className={classes.divider} />
            <Typography variant="subtitle2">
              Order reference: {order.customer_reference}{" "}
            </Typography>
          </Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back to Home
        </Button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase
            <Divider className={classes.divider} />
          </Typography>
        </div>
        <br />
        <Button component={Link} to="/" variant="outlined" type="button">
          Back to Home
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    <>
      <Typography variant="h5">Error: {error}</Typography>
      <br />
      <Button component={Link} to="/home" variant="outlined" type="button">
        Back to Home
      </Button>
    </>;
  }

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => {
              return (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;