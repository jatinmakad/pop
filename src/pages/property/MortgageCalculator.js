import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../components/ErrorMessage";
import { NumberInput, NumberInputWithDot } from "@/utils/constants";
import { inRange, isEmpty, isNumber } from "lodash";
import AuthContext from "@/context/AuthContext";
import UpfrontDialogbox from "./UpfrontDialogbox";
import { apiGet } from "@/utils/apiFetch";
import apiPath from "@/utils/apiPath";
import Helpers from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import CurrencyInput from 'react-currency-input-field';
const MortgageCalculator = ({ property, monthly }) => {
  const { t } = useTranslation();
  let { config } = useContext(AuthContext);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({});
  const [loanSummary, setLoanSummary] = useState({
    upfront: 0,
    downPaymentAmount: 0,
    TotalPurchaseCost: 0,
    landDepartmentFee: 0,
    registrationFee: 0,
    mortgageRegistrationFee: 0,
    agencyFee: 0,
    bankArrangementFee: 0,
    valuationFee: 0,
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    trigger,
    reset,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      price: property?.price || 4000000,
      loanTerm: 10,
      interestRate: 4.24,
      downPayment: 800000,
    },
  });

  useEffect(() => {
    if (!isEmpty(property) && !isEmpty(fields)) {
      if (property?.price > 0 && isNumber(property?.price)) {
        setValue("price", Number(property?.price));
        setValue(
          "percent",
          Number(fields?.maxDownPaymentPercentage)
        );
        setValue("downPayment", (Number(Number(fields?.maxDownPaymentPercentage) / 100) * Number(property?.price)));
        let obj = {
          downPayment: Number(Number(fields?.maxDownPaymentPercentage) / 100) * Number(property?.price),
          percent: Number(fields?.maxDownPaymentPercentage),
          price: Number(property?.price),
          loanTerm: 10,
          interestRate: 5,
        };
        MonthlyEmi(obj);
        loadSummaryObj(obj);
      } else {
        setValue("price", 50000);
        setValue("percent", ((50000 / 2 / 50000) * 100)?.toFixed(0));
        setValue("downPayment", 50000 / 2);
        let obj = {
          downPayment: Number(50000 / 2),
          percent: ((50000 / 2 / 50000) * 100)?.toFixed(0),
          price: Number(50000),
          loanTerm: 10,
          interestRate: 5,
        };
        MonthlyEmi(obj);
        loadSummaryObj(obj);
      }
    }
  }, [property, fields]);

  const onSubmit = () => { };

  const MonthlyEmi = (obj) => {
    let LoanAmount = Number(obj?.price - obj?.downPayment);
    let interestAmount =
      (Number(LoanAmount * obj?.interestRate) / 100) * Number(obj?.loanTerm)
    let emi = Number(LoanAmount + interestAmount) / Number(obj?.loanTerm) / 12;
    if (emi > 0) {
      setMonthlyPayment(emi?.toFixed(2));
      monthly(emi?.toFixed(2));
    }
  };

  const getMasterData = async () => {
    const { status, data } = await apiGet(apiPath.mortgageSettings);
    if (status === 200) {
      if (data.success) {
        setFields(data.results);
      }
    }
  };

  const loadSummaryObj = (obj, fields) => {
    let agencyFeeNew =
      (Number(fields?.RealEstateAgencyFee?.PropertyValuePercentage) *
        Number(obj?.price)) /
      100;
    let landDepartmentFeeValue = ((Number(fields?.LandDepartmentFee?.PropertyPercentage) *
      Number(obj?.price)) /
      100)
    let landDepartmentFee =
      landDepartmentFeeValue +
      Number(fields?.LandDepartmentFee?.AdminFee);
    let landDepartmentFeeSaudi =
      landDepartmentFeeValue +
      ((Number(fields?.LandDepartmentFee?.AdminFee) *
        Number(landDepartmentFeeValue)) /
        100)
    let registrationFee = ''
    if (Number(obj?.price) > 500000) {
      registrationFee = Number(fields?.RegistrationFee?.AboveFiveLac?.Price) +
        ((Number(fields?.RegistrationFee?.AboveFiveLac?.VAT) *
          Number(fields?.RegistrationFee?.AboveFiveLac?.Price)) /
          100)
    } else {
      registrationFee = Number(fields?.RegistrationFee?.UptoTwoLac?.Price) +
        ((Number(fields?.RegistrationFee?.UptoTwoLac?.VAT) *
          Number(fields?.RegistrationFee?.UptoTwoLac?.Price)) /
          100)
    }
    // let registrationFee =
    //   Number(obj?.price) > 500000
    //     ? Number(fields?.RegistrationFee?.AboveFiveLac?.Price) +
    //     (Number(fields?.RegistrationFee?.AboveFiveLac?.VAT) *
    //       Number(fields?.RegistrationFee?.AboveFiveLac?.Price)) /
    //     100
    //     : Number(fields?.RegistrationFee?.UptoTwoLac?.Price) +
    //     (Number(fields?.RegistrationFee?.UptoTwoLac?.VAT) *
    //       Number(fields?.RegistrationFee?.UptoTwoLac?.Price)) /
    //     100;
    let mortgageRegistrationFee =
      (fields?.MortgageRegistrationFee?.LoanAmountPercentage *
        Number(Number(obj?.price) - Number(obj?.downPayment))) /
      100 +
      Number(fields?.MortgageRegistrationFee?.AdminFee);
    let agencyFee =
      agencyFeeNew +
      (Number(fields?.RealEstateAgencyFee?.VATPercentage) * Number(agencyFeeNew)) / 100;
    let bankArrangementFee =
      (Number(fields?.BankArrangementFee?.LoanAmountPercentageMaximum) *
        Number(Number(obj?.price) - Number(obj?.downPayment))) /
      100 +
      (Number(fields?.BankArrangementFee?.VATPercentage) *
        ((Number(fields?.BankArrangementFee?.LoanAmountPercentageMaximum) *
          Number(Number(obj?.price) - Number(obj?.downPayment))) /
          100)) /
      100;
    let valuationFee =
      Number(fields?.ValuationFee?.Max) +
      (Number(fields?.ValuationFee?.Vat) * Number(fields?.ValuationFee?.Max)) / 100;
    setLoanSummary({
      downPaymentAmount: Number(watch("downPayment")),
      downPaymentPer: Number(watch("percent")),
      TotalPurchaseCostUAE:
        landDepartmentFee +
        registrationFee +
        mortgageRegistrationFee +
        agencyFee +
        bankArrangementFee +
        valuationFee,
      TotalPurchaseCostSaudi: Number(landDepartmentFeeSaudi + agencyFee),
      landDepartmentFee: Number(landDepartmentFee),
      landDepartmentFeeSaudi: Number(landDepartmentFeeSaudi),
      registrationFee: Number(registrationFee),
      mortgageRegistrationFee: Number(mortgageRegistrationFee),
      agencyFee: Number(agencyFee),
      bankArrangementFee: Number(bankArrangementFee),
      valuationFee: Number(valuationFee),
      monthlyPayment: Number(monthlyPayment),
      LoanAmount: Number(obj?.price - obj?.downPayment),
      percent: Number(watch("interestRate")),
      price: Number(watch("price")),
    });
  };

  useEffect(() => {
    getMasterData();
  }, []);

  useEffect(() => {
    let obj = {
      downPayment: Number(watch("downPayment")),
      percent: Number(watch("percent")),
      price: Number(watch("price")),
      loanTerm: Number(watch("loanTerm")),
      interestRate: Number(watch("interestRate")),
    };
    loadSummaryObj(obj, fields);
    MonthlyEmi(obj);
  }, [
    watch("downPayment"),
    watch("percent"),
    watch("price"),
    watch("loanTerm"),
    watch("interestRate"),
    fields
  ]);

  return (
    <div className="mortage-calc rounded">
      <div className="mortage-calc-row">
        <figure>
          <img src="../images/home_prop.png" />
        </figure>
        <figcaption>
          <h2>{t("MORTGAGE_CALCULATOR")}</h2>
          <p>{t("ESTIMATES_YOUR_MONTHLY_MORTGAGE_PAYMENTS")}</p>
        </figcaption>
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="gx-2">
          <Col lg={12} md={6}>
            <FloatingLabel
              controlId="floatingInput"
              label={`${t("PROPERTY_PRICE")} (${config?.currency})`}
              style={{ position: "relative" }}
              className="mb-3"
            >
              {/* <Form.Control
                placeholder={`${t("PROPERTY_PRICE")} (${config?.currency})`}
                type="text"
                maxLength={9}
                {...register("price", {
                  required: {
                    value: true,
                    message: t("PLEASE_ENTER_PRICE"),
                  },
                  validate: (value) => {
                    if (value < 50000) {
                      return t("THE_PROPERTY_VALUE_MUST_BE_AT_LEAST_50000");
                    }
                    let downPayment = (watch("percent") * value) / 100;
                    setValue("downPayment", downPayment);
                  },
                })}
                onKeyPress={NumberInputWithDot}
              /> */}
              <Controller
                control={control}
                name="price"
                rules={{
                  required: {
                    value: true,
                    message: t("PLEASE_ENTER_PRICE"),
                  },
                  // validate: (value) => {
                  //   if (value < 50000) {
                  //     return t("THE_PROPERTY_VALUE_MUST_BE_AT_LEAST_50000");
                  //   }
                  //   let downPayment = (watch("percent") * value) / 100;
                  //   setValue("downPayment", downPayment);
                  // },
                }}
                render={({ field: { ref, ...field } }) => (
                  <CurrencyInput
                    className='formatted-input form-control'
                    name={field.name}
                    value={field.value}
                    decimalsLimit={2}
                    allowNegativeValue={false}
                    maxLength={9}
                    placeholder={`${t("PROPERTY_PRICE")} (${config?.currency})`}
                    onValueChange={(value, name) => {
                      field.onChange(value)
                      console.log(value,'value')
                      if (value < 50000) {
                        return t("THE_PROPERTY_VALUE_MUST_BE_AT_LEAST_50000");
                      }
                      let downPayment = (watch("percent") * value) / 100;
                      setValue("downPayment", downPayment);
                    }}
                  />
                )}
              />
            </FloatingLabel>
            <ErrorMessage message={errors?.price?.message} />
          </Col>
          <Col lg={12} md={6}>
            <FloatingLabel
              controlId="floatingInput"
              label={t("LOAN_TERMS_YEARS")}
              className="mb-3"
            >
              <Form.Control
                type="text"
                maxLength={2}
                placeholder={t("LOAN_TERMS_YEARS")}
                {...register("loanTerm", {
                  required: {
                    value: true,
                    message: t("THE_LOAN_TERM_MUST_BE_AT_LEAST_2_YEARS"),
                  },
                  validate: (value) => {
                    if (value > 25) {
                      return t("THE_LOAN_TERM_MUST_BE_AT_MOST_25_YEARS");
                    } else if (value < 2) {
                      return t("THE_LOAN_TERM_MUST_BE_AT_LEAST_2_YEARS");
                    }
                  },
                })}
                onKeyPress={NumberInputWithDot}
              />
            </FloatingLabel>
            <ErrorMessage message={errors?.loanTerm?.message} />
          </Col>

          <Col md={12} className="mb-3">
            <Row className="gx-0 down-payment bg-white rounded">
              <Col md={7} className="">
                <FloatingLabel
                  controlId="floatingInput"
                  label={`${t("DOWN_PAYMENT")} (${config?.currency})`}
                  className="border-end-0"
                >
                  {/* <Form.Control
                    type="text"
                    maxLength={9}
                    placeholder={`${t("DOWN_PAYMENT")} (${config?.currency})`}
                    {...register("downPayment", {
                      required: {
                        value: true,
                        message: t("PLEASE_ENTER_A_DOWN_PAYMENT"),
                      },
                      validate: (value) => {
                        let minPercentage =
                          ((Number(fields?.minDownPaymentPercentage)) / 100) *
                          watch("price");
                        let maxPercentage = (Number(fields?.maxDownPaymentPercentage) / 100) * watch("price");
                        if (minPercentage > value) {
                          setValue("percent", "-");
                          return `${t("THE_DOWN_PAYMENT_AMOUNT_MUST_BE_AT_LEAST")} ${fields?.minDownPaymentPercentage}% of property value`;
                        } else if (maxPercentage < value) {
                          setValue("percent", "-");
                          return `${t("THE_DOWN_PAYMENT_AMOUNT_MUST_BE_AT_MOST_80_PROPERTY_VALUE")} ${fields?.maxDownPaymentPercentage}% of property value`;
                        } else {
                          let per = ((value / watch("price")) * 100)?.toFixed(
                            0
                          );
                          setValue("percent", per);
                        }
                      },
                    })}
                    onKeyPress={NumberInputWithDot}
                  /> */}
                  <Controller
                    control={control}
                    name="downPayment"
                    rules={{
                      required: {
                        value: true,
                        message: t("PLEASE_ENTER_A_DOWN_PAYMENT"),
                      },
                      // validate: (value) => {
                      //   let minPercentage =
                      //     ((Number(fields?.minDownPaymentPercentage)) / 100) *
                      //     watch("price");
                      //   let maxPercentage = (Number(fields?.maxDownPaymentPercentage) / 100) * watch("price");
                      //   if (minPercentage > value) {
                      //     setValue("percent", "-");
                      //     return `${t("THE_DOWN_PAYMENT_AMOUNT_MUST_BE_AT_LEAST")} ${fields?.minDownPaymentPercentage}% of property value`;
                      //   } else if (maxPercentage < value) {
                      //     setValue("percent", "-");
                      //     return `${t("THE_DOWN_PAYMENT_AMOUNT_MUST_BE_AT_MOST_80_PROPERTY_VALUE")} ${fields?.maxDownPaymentPercentage}% of property value`;
                      //   } else {
                      //     let per = ((value / watch("price")) * 100)?.toFixed(
                      //       0
                      //     );
                      //     setValue("percent", per);
                      //   }
                      // },
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <CurrencyInput
                        className='formatted-input form-control'
                        name={field.name}
                        value={field?.value}
                        decimalsLimit={2}
                        allowNegativeValue={false}
                        maxLength={9}
                        placeholder={`${t("DOWN_PAYMENT")} (${config?.currency})`}
                        onValueChange={(value, name) => {
                          field.onChange(value)
                          let minPercentage =
                            ((Number(fields?.minDownPaymentPercentage)) / 100) *
                            watch("price");
                          let maxPercentage = (Number(fields?.maxDownPaymentPercentage) / 100) * watch("price");
                          if (minPercentage > value) {
                            setValue("percent", "-");
                            return `${t("THE_DOWN_PAYMENT_AMOUNT_MUST_BE_AT_LEAST")} ${fields?.minDownPaymentPercentage}% of property value`;
                          } else if (maxPercentage < value) {
                            setValue("percent", "-");
                            return `${t("THE_DOWN_PAYMENT_AMOUNT_MUST_BE_AT_MOST_80_PROPERTY_VALUE")} ${fields?.maxDownPaymentPercentage}% of property value`;
                          } else {
                            let per = ((value / watch("price")) * 100)?.toFixed(
                              0
                            );
                            setValue("percent", per);
                          }
                        }}
                      />
                    )}
                  />
                </FloatingLabel>
              </Col>
              <Col md={5}>
                <FloatingLabel
                  controlId='floatingInput'
                  label={t("PERCENT")}
                  className='border-start-0 pe-0 percent_input'
                >
                  <Form.Control
                    type="text"
                    placeholder={t("PERCENT")}
                    className="border-start-0 mt-1 me-2"
                    disabled
                    {...register("percent")}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <ErrorMessage message={errors?.downPayment?.message} />
          </Col>
          <Col md={12}>
            <FloatingLabel
              controlId="floatingInput"
              label={t("INTEREST_RATE")}
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder={t("INTEREST_RATE")}
                {...register("interestRate", {
                  required: {
                    value: true,
                    message: t("THE_INTEREST_RATE_MUST_BE_AT_LEAST"),
                  },
                  validate: (value) => {
                    if (value < 0.45) {
                      return t("THE_INTEREST_RATE_MUST_BE_AT_LEAST");
                    } else if (value > 10.55) {
                      return t("THE_INTEREST_RATE_MUST_BE_AT_MOST");
                    }
                  },
                })}
                onKeyPress={NumberInputWithDot}
              />
            </FloatingLabel>
            <ErrorMessage message={errors?.interestRate?.message} />
          </Col>
          <Col md={12} className="mb-3">
            <Button onClick={() => setOpen(true)} className="text-white fs-6">
              {t("VIEW_UPFRONT_COSTS")}
            </Button>
          </Col>
          {/* <Col md={12}>
            <button
              type="submit"
              className="text-white border-0 bg-green p-2 rounded text-dark fs-6"
            >
              Get pre-approved
            </button>
          </Col> */}
        </Row>
      </Form>
      <div className="d-flex justify-content-between align-items-center monthly-payment">
        <span> {t("MONTHLY_PAYMENT")}</span>
        <strong style={{ color: !isEmpty(errors) && "grey" }}>
          {Helpers?.priceFormat(monthlyPayment)} {config?.currency}
        </strong>
      </div>

      <div className="mortgage-finder">
        <h6>
          {t("FIND_OUT_WHY_THOUSANDS_OF_HOME_BUYERS")} <br />  {t("CHOOSE")}{" "}
          <Link href="/" className="text-green">
            {t("MORTGAGE_FINDER")}
          </Link>
          {t("AS_THEIR_PREFERRED_ADVISOR")}
        </h6>
      </div>
      {open && (
        <UpfrontDialogbox
          fields={fields}
          data={loanSummary}
          open={open}
          onHide={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default MortgageCalculator;
