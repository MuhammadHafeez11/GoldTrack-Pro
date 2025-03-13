// src/components/AddCustomer.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./customer.css";
import { FaArrowLeft } from "react-icons/fa";
import { addCustomer, clearErrors } from "../../redux/actions/customerAction";
import Sidebar from "../Home/components/Sidebar";
import { RESET_CUSTOMER_SUCCESS } from "../../redux/constants/customerConstant";
import { pakCities } from "../Home/Data/Data";
// import { pakCities } from "../../data/pakCities"; // Import city data

const AddCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.customer);

  const initialFormData = {
    name: "",
    phoneNumber: "",
    cellNumber: "",
    gender: "",
    dateOfBirth: "",
    CNIC: "",
    CNICFront: "",
    CNICBack: "",
    address: {
      country: "Pakistan", // Fixed country
      state: "", // Province (will be selected from drop-down)
      city: "",  // City will be dynamically populated based on state
      streetAddress: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);

  // Refs for file inputs
  const fileInputFrontRef = useRef(null);
  const fileInputBackRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phoneNumber and cellNumber: allow only digits and max length of 11
    if (name === "phoneNumber" || name === "cellNumber") {
      const digitOnly = value.replace(/\D/g, "");
      if (digitOnly.length <= 11) {
        setFormData({ ...formData, [name]: digitOnly });
      }
    }
    // For address fields passed as "address.state", "address.city", "address.streetAddress"
    else if (name.startsWith("address.")) {
      const [_, key] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phoneNumber, cellNumber, gender, CNIC } = formData;
    if (!name || !phoneNumber || !gender || !CNIC) {
      toast.error(t("pleaseFillAllFields"));
      return;
    }
    if (phoneNumber.length !== 11) {
      toast.error(
        t("phoneMustBe11Digits", "Phone number must be exactly 11 digits (e.g., 03001234567).")
      );
      return;
    }
    if (cellNumber && cellNumber.length !== 11) {
      toast.error(
        t("phoneMustBe11Digits", "Cell number must be exactly 11 digits (e.g., 03001234567).")
      );
      return;
    }
    if (CNIC.length !== 13) {
      toast.error(t("cnicMustBe13Digits", "CNIC must be exactly 13 digits."));
      return;
    }

    // Prepare form data to send
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("cellNumber", formData.cellNumber);
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append("CNIC", formData.CNIC);

    // For address, we store the state and city values (or labels) along with streetAddress
    const addressToSend = {
      country: formData.address.country,
      state: formData.address.state, // Already the selected province name (e.g., "Punjab")
      city: formData.address.city,   // The selected city name
      streetAddress: formData.address.streetAddress,
    };
    formDataToSend.append("address", JSON.stringify(addressToSend));

    if (formData.CNICFront) formDataToSend.append("CNICFront", formData.CNICFront);
    if (formData.CNICBack) formDataToSend.append("CNICBack", formData.CNICBack);

    dispatch(addCustomer(formDataToSend));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(t("customerAddedSuccessfully"));
      setFormData(initialFormData);
      if (fileInputFrontRef.current) fileInputFrontRef.current.value = "";
      if (fileInputBackRef.current) fileInputBackRef.current.value = "";
      dispatch({ type: RESET_CUSTOMER_SUCCESS });
    }
  }, [success, dispatch, t, initialFormData]);

  // Get the list of cities for the selected state (if any)
  const cityOptions =
    formData.address.state && pakCities[formData.address.state]
      ? pakCities[formData.address.state]
      : [];

  return (
    <div className="App">
      <div className="Glass">
        <Sidebar />
        <div className="add-customer-container">
          <form onSubmit={handleSubmit} className="add-customer-form">
            <h2>{t("addNewCustomer")}</h2>
            <div className="form-group">
              <label>{t("customerName")}*</label>
              <input
                type="text"
                name="name"
                placeholder={t("enterCustomerName")}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("phoneNumber")}*</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("cellNumber")}</label>
              <input
                type="tel"
                name="cellNumber"
                placeholder="Enter Cell Number"
                value={formData.cellNumber}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>{t("gender")}*</label>
              <select
                className="form-control"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectGender")}</option>
                <option value="Male">{t("male")}</option>
                <option value="Female">{t("female")}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t("dateOfBirth")}*</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>{t("cnic")}*</label>
              <input
                type="text"
                name="CNIC"
                placeholder={t("enterCnic")}
                value={formData.CNIC}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("cnicFrontImage")}*</label>
              <input
                type="file"
                name="CNICFront"
                ref={fileInputFrontRef}
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("cnicBackImage")}*</label>
              <input
                type="file"
                name="CNICBack"
                ref={fileInputBackRef}
                onChange={handleFileChange}
                required
              />
            </div>
            {/* Country is fixed */}
            <div className="form-group">
              <label>{t("country")}*</label>
              <select
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
                // disabled
              >
                <option value="Pakistan">Pakistan</option>
              </select>
            </div>
            {/* Province Drop-down */}
            <div className="form-group">
              <label>{t("state")}*</label>
              <select
                name="address.state"
                value={formData.address.state || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value, city: "" },
                  }))
                }
                required
              >
                <option value="">Select Province</option>
                <option value="Punjab">Punjab</option>
                <option value="Sindh">Sindh</option>
                <option value="KPK">KPK</option>
                <option value="Balochistan">Balochistan</option>
                <option value="Islamabad_Capital_Territory">Islamabad_Capital_Territory</option>
                <option value="Gilgit_Baltistan">Gilgit_Baltistan</option>
                <option value="Azad_Kashmir">Azad_Kashmir</option>
              </select>
            </div>
            {/* City Drop-down */}
            <div className="form-group">
              <label>{t("city")}*</label>
              <select
                name="address.city"
                value={formData.address.city || ""}
                onChange={handleChange}
                style={{maxHeight: "100px"}}
                required
              >
                <option value="">Select City</option>
                {cityOptions.map((city, index) => (
                  <option key={`${city}-${index}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t("streetAddressOptional")}</label>
              <input
                type="text"
                name="address.streetAddress"
                value={formData.address.streetAddress}
                onChange={handleChange}
                placeholder={t("streetAddressOptional")}
              />
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? t("adding") : t("addCustomer")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;