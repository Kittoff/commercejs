import React, { FC, useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import FormInput from "./CustomTextField";

import { commerce } from "../../lib/commerce";

interface Props {
  checkoutToken: any;
  next: any;
}

const AddressForm: FC<Props> = ({ checkoutToken, next }) => {
  const [shippingCountries, setshippingCountries] = useState<any>([]);
  const [shippingCountry, setshippingCountry] = useState<any>("");
  const [shippingSubDivisions, setShippingSubDivisions] = useState<any>([]);
  const [shippingSubDivision, setShippingSubDivision] = useState<any>("");
  const [shippingOptions, setShippingOptions] = useState<any>([]);
  const [shippingOption, setShippingOption] = useState<any>("");
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  const subdivisions = Object.entries(shippingSubDivisions).map(
    ([code, name]) => ({
      id: code,
      label: name,
    })
  );
  const options = shippingOptions.map((so: any) => {
    return {
      id: so,
      label: `${so.description} - (${so.price.formated_with_symbol})`,
    };
  });

  const fetchShippingCountries = async (checkoutTokenId: any) => {
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    );

    setshippingCountries(countries);
    setshippingCountry(Object.keys(countries)[0]);
  };

  const fetchSubdivisions = async (countryCode: any) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(
      countryCode
    );
    setShippingSubDivisions(subdivisions);
    setShippingSubDivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (
    checkoutTokenId: any,
    country: any,
    region: any = null
  ) => {
    const options: any = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region }
    );
    setShippingOptions(options);
    setShippingOption(options[0].id);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubDivision)
      fetchShippingOptions(
        checkoutToken.id,
        shippingCountry,
        shippingSubDivision
      );
  }, [shippingSubDivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              shippingCountry,
              shippingSubDivision,
              shippingOption,
            })
          )}
        >
          <Grid container spacing={3}>
            <FormInput required name="firstname" label="First name" />
            <FormInput required name="lastname" label="Last name" />
            <FormInput required name="address1" label="First Address" />
            <FormInput required name="email" label="Email" />
            <FormInput required name="city" label="City" />
            <FormInput required name="zipcode" label="Zip code" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Country</InputLabel>

            <Select
              value={shippingCountry}
              fullWidth
              onChange={(e) => setshippingCountry(e.target.value)}
            >
              {countries.map((country: any) => (
                <MenuItem value={country.id} key={country.id}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Subdivision</InputLabel>

            <Select
              value={shippingSubDivision}
              fullWidth
              onChange={(e) => setShippingSubDivision(e.target.value)}
            >
              {subdivisions.map((subdivision: any) => (
                <MenuItem value={subdivision.id} key={subdivision.id}>
                  {subdivision.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Options</InputLabel>

            <Select
              value={shippingOption}
              fullWidth
              onChange={(e) => setShippingOption(e.target.value)}
            >
              {shippingOptions
                .map((shippingOption: any) => ({
                  id: shippingOption.id,
                  label: `${shippingOption.description} - (${shippingOption.price.formatted_with_symbol})`,
                }))
                .map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
          <br />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button component={Link} to="/cart" variant="outlined">
              Back to Cart
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
