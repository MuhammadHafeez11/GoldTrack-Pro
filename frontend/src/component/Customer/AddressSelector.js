// src/components/AddressSelector.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { pakistan } from '../Home/Data/pakistanData';

const AddressSelector = ({ address, setAddress }) => {
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  // Build province options from pakistan keys
  useEffect(() => {
    const provinces = Object.keys(pakistan).map(prov => ({
      value: prov,
      label: prov
    }));
    setProvinceOptions(provinces);
  }, []);

  // Update city options when a province is selected
  useEffect(() => {
    if (address.state) {
      // Get the raw data for the selected province
      const provinceData = pakistan[address.state];
      let cities = [];
      if (Array.isArray(provinceData)) {
        provinceData.forEach(item => {
          if (typeof item === 'string') {
            cities.push(item);
          } else if (typeof item === 'object') {
            // Each object has one key whose value is an array of cities
            const key = Object.keys(item)[0];
            cities = cities.concat(item[key]);
          }
        });
      }
      // Remove duplicates if any
      cities = Array.from(new Set(cities));
      const options = cities.map(city => ({
        value: city,
        label: city
      }));
      setCityOptions(options);
      // Reset selected city
      setAddress(prev => ({ ...prev, city: "" }));
    } else {
      setCityOptions([]);
    }
  }, [address.state, setAddress]);

  // Handler for province change
  const handleProvinceChange = (selectedOption) => {
    setAddress(prev => ({
      ...prev,
      state: selectedOption ? selectedOption.value : "",
      city: ""
    }));
  };

  // Handler for city change
  const handleCityChange = (selectedOption) => {
    setAddress(prev => ({
      ...prev,
      city: selectedOption ? selectedOption.value : ""
    }));
  };

  return (
    <div className="address-selector">
      <div className="form-group">
        <label>Province*</label>
        <Select
          options={provinceOptions}
          value={
            provinceOptions.find(option => option.value === address.state) || null
          }
          onChange={handleProvinceChange}
          placeholder="Select Province"
          isSearchable
        />
      </div>
      <div className="form-group">
        <label>City*</label>
        <Select
          options={cityOptions}
          value={
            cityOptions.find(option => option.value === address.city) || null
          }
          onChange={handleCityChange}
          placeholder="Select City"
          isSearchable
          isDisabled={!address.state}
        />
      </div>
    </div>
  );
};

export default AddressSelector;