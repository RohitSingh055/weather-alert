import React, { useState, useEffect } from "react";
import "./WeatherAlertForm.css";
import { createDocument } from "../database";

const WeatherAlertForm = () => {
  const [email, setEmail] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    // Fetch list of Indian states
    const fetchIndianStates = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json"
        );
        const data = await response.json();
        const indianStates = data.find((country) => country.name === "India").states;
        setStateOptions(indianStates);
      } catch (error) {
        console.error("Error fetching Indian states:", error);
      }
    };

    fetchIndianStates();
  }, []);

  const handleStateChange = (selectedState) => {
    const selectedStateData = stateOptions.find((state) => state.name === selectedState);
    if (selectedStateData) {
      setCityOptions(selectedStateData.cities);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var data = { email: email, city: city };
    try {
      const response = await createDocument(data);
      console.log("Document created:", response);
      setEmail("");
      setCity("");
    } catch (error) {
      console.log(error);
    }

    setSubmitted(true);
  };

  const renderConfirmation = () => {
    return (
      <div className="container">
        <h1>Thank You!</h1>
        <p>
          Email will be sent from: <strong>rohitrsn005@gmail.com</strong>
        </p>
        <p>
          You will receive an email whenever there are weather alerts in your
          city.
        </p>
      </div>
    );
  };

  return (
    <div>
      {!submitted ? (
        <div className="container">
          <h1>Get Notified for Weather Alerts</h1>
          <div className="weather-icon">
            <span className="cloud-icon">&#9729;</span>
            <span className="sun-icon">&#9728;</span>
            <span className="rain-icon">&#9730;</span>
            <span className="snow-icon">&#10052;</span>
            <span className="thunderstorm-icon">&#9889;</span>
          </div>
          <p>
            You will receive weather alerts if the weather in your city is not
            safe for you to go outside.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
            />
            <br />
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                handleStateChange(e.target.value);
              }}
              className="custom-dropdown"
              required
            >
              <option value="">Select your state</option>
              {stateOptions.map((state, index) => (
                <option key={index} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            <br />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="custom-dropdown"
              required
            >
              <option value="">Select your city</option>
              {cityOptions.map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <br />
            <button type="submit">Notify</button>
          </form>
        </div>
      ) : (
        renderConfirmation()
      )}
    </div>
  );
};

export default WeatherAlertForm;
