import AuthContext from "@/context/AuthContext";
import Helpers from "@/utils/helpers";
import { t } from "i18next";
import React, { useContext, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const UpfrontDialogbox = ({ open, onHide, data, fields }) => {
  const [hide, setHide] = useState(false);
  const { config } = useContext(AuthContext)

  return (
    <Modal show={open} onHide={onHide} className="Loan_amount_modal">
      <Modal.Header
        className="d-flex justify-content-center"
        closeButton
      ></Modal.Header>
      <Modal.Body>
        <div className="summary_title"> {t("LOAN_SUMMARY")}</div>
        <div className="amount_required border-bottom">
          <span>{t("Amount_required_upfront")}</span>
          <span>{Helpers?.priceFormat(config?.country === "UAE" ? data?.downPaymentAmount + data?.TotalPurchaseCostUAE : data?.downPaymentAmount + data?.TotalPurchaseCostSaudi)} {config?.currency}</span>
        </div>
        <div className="amount_required_list">
          <div className="amount_required_left">
            <strong>{t("Downpayment_amount")}</strong>
            <small>{data?.downPaymentPer}% {t("of_the_property_value")} </small>
          </div>
          <span className="amount_fixed">{Helpers?.priceFormat(data?.downPaymentAmount)} {config?.currency} </span>
        </div>
        <div className="total_purchase_cost">
          <div className="amount_required_list">
            <div className="amount_required_left">
              <strong>{t("Total_purchase_costs")}</strong>
              <small>
                {t("One_time_costs_and_fees")} {config?.currency}
              </small>
            </div>
            <span className="amount_fixed">
              {Helpers?.priceFormat(config?.country === "UAE" ? data?.TotalPurchaseCostUAE : data?.TotalPurchaseCostSaudi)} {config?.currency}
              <small className="p-2 pb-0 cursor-pointer" onClick={() => setHide(!hide)}>
                <img src="../images/down-arrow.png" style={{ rotate: hide ? "180deg" : '0deg' }} alt="" />
                {/* <svg
                  data-dir="down"
                  class="mf-chevron-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  fontWeight={"bold"}
                  height="11"
                  viewBox="0 0 8 14"
                >
                  <path d="M7.69 1.817a1.07 1.07 0 0 0 0-1.505 1.05 1.05 0 0 0-1.493 0L.31 6.247a1.07 1.07 0 0 0 0 1.506l5.888 5.935a1.05 1.05 0 0 0 1.494 0 1.07 1.07 0 0 0 0-1.505L2.55 7l5.14-5.183z"></path>
                </svg> */}
              </small>
            </span>
          </div>

          <div className={`total_purchase__detail ${!hide && "d-none"}`}>
            <h4>{t("Costs_and_fees_breakdown")}</h4>
            <div className="amount_required_list">
              <div className="amount_required_left">
                <strong>{t("Land_Department_Fee")}</strong>
                <small>{fields?.LandDepartmentFee?.PropertyPercentage > 0 ? `${fields?.LandDepartmentFee?.PropertyPercentage}% ${t("of_the_property_value")} +` : ""}  {config?.country == 'UAE' ? `${fields?.LandDepartmentFee?.AdminFee} ${config?.currency} ${t("admin_fee")}` : `${fields?.LandDepartmentFee?.AdminFee}% ${t("VAT")}`}</small>
              </div>
              <span className="amount_fixed">{Helpers?.priceFormat(config?.country == 'UAE' ? data?.landDepartmentFee : data?.landDepartmentFeeSaudi)} {config?.currency} </span>
            </div>
            {config?.country == 'UAE' &&
              <div className="amount_required_list">
                <div className="amount_required_left">
                  <strong>{t("Registration_Fee")}</strong>
                  {data?.price > 500000 ?
                    <small>
                      {fields?.RegistrationFee?.AboveFiveLac?.Price} {config?.currency} {t("for_properties_over")} {fields?.RegistrationFee?.AboveFiveLac?.VAT > 0 ? `+ ${fields?.RegistrationFee?.AboveFiveLac?.VAT}% ${t("VAT")}` : ""}
                    </small> : <small>
                      {fields?.RegistrationFee?.UptoTwoLac?.Price} {config?.currency} {t("for_properties_below")} {fields?.RegistrationFee?.UptoTwoLac?.VAT ? `+ ${fields?.RegistrationFee?.UptoTwoLac?.VAT}% ${t("VAT")}` : ""}
                    </small>
                  }
                </div>
                <span className="amount_fixed">{Helpers?.priceFormat(data?.registrationFee)} {config?.currency} </span>
              </div>}
            {config?.country == 'UAE' &&
              <div className="amount_required_list">
                <div className="amount_required_left">
                  <strong>{t("Mortgage_Registration_Fee")}</strong>
                  <small>{fields?.MortgageRegistrationFee?.LoanAmountPercentage > 0 ? `${fields?.MortgageRegistrationFee?.LoanAmountPercentage}% ${t("of_the_loan_amount")} +` : ""} {fields?.MortgageRegistrationFee?.AdminFee} {config?.currency} {t("admin_fee")}</small>
                </div>
                <span className="amount_fixed">{Helpers?.priceFormat(data?.mortgageRegistrationFee)} {config?.currency} </span>
              </div>}

            <div className="amount_required_list">
              <div className="amount_required_left">
                <strong>{t("Real_Estate_Agency_Fee")}</strong>
                <small>{fields?.RealEstateAgencyFee?.PropertyValuePercentage > 0 ? `${t("Typically")} ${fields?.RealEstateAgencyFee?.PropertyValuePercentage}% ${t("of_the_property_value")}` : ''} {fields?.RealEstateAgencyFee?.VATPercentage > 0 ? `+ ${fields?.RealEstateAgencyFee?.VATPercentage}% ${t("VAT")}` : ""}</small>
              </div>
              <span className="amount_fixed">{Helpers?.priceFormat(data?.agencyFee)} {config?.currency} </span>
            </div>

            {config?.country == 'UAE' &&
              <div className="amount_required_list">
                <div className="amount_required_left">
                  <strong>{t("Bank_Arrangement_Fee")}</strong>
                  <small>{t("Between")} {fields?.BankArrangementFee?.LoanAmountPercentageMinimum}% {t("to")} {fields?.BankArrangementFee?.LoanAmountPercentageMaximum}% {t("of_the_loan_amount")} {fields?.BankArrangementFee?.VATPercentage > 0 ? `+ ${fields?.BankArrangementFee?.VATPercentage}% ${t("VAT")}` : ""}</small>
                </div>
                <span className="amount_fixed">{Helpers?.priceFormat(data?.bankArrangementFee)} {config?.currency} </span>
              </div>}
            {config?.country == 'UAE' &&
              <div className="amount_required_list">
                <div className="amount_required_left">
                  <strong>{t("Valuation_Fee")}</strong>
                  <small>{t("Between")} {fields?.ValuationFee?.Min} and {fields?.ValuationFee?.Max} {config?.currency} {fields?.ValuationFee?.Vat > 0 ? `+ ${fields?.ValuationFee?.Vat}% ${t("VAT")}` : ""}</small>
                </div>
                <span className="amount_fixed">{Helpers?.priceFormat(data?.valuationFee)} {config?.currency} </span>
              </div>}
          </div>
        </div>

        {/* <div className="add_fees_outer">
          <h4>Add fees to mortgage payment? </h4>
          <p>
            Some lenders allow you to bundle certain costs and fees in your
            monthly payment, in this way reducing the total amount required
            upfront
          </p>
        </div> */}

        <div className="value_part">
          <div className="value_part_left">
            <strong>
              {Helpers?.priceFormat(data?.monthlyPayment)} {config?.currency}
            </strong>
            <small>{t("monthly_payment")}</small>
          </div>

          {/* <Button className="py-2 py-md-3 px-4">Get pre-approved</Button> */}
        </div>

        <p>
          * {t("Estimated_monthly1")} {Helpers?.priceFormat(data?.LoanAmount)} {config?.currency} {t("Estimated_monthly2")} {Helpers?.priceFormat(data?.percent)}% {t("Estimated_monthly3")}
        </p>
        <p>
          {t("last_Line")}
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default UpfrontDialogbox;
