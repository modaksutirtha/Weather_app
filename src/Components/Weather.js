import React, { useEffect, useRef, useState } from "react";
import Humidity_icon from "../Images/humidity.png";
import Rain from "../Images/rain.png";
import Snow from "../Images/snow.png";
import Wind from "../Images/wind.png";
import Clear from "../Images/clear.png"
import Cloud from "../Images/cloud.png";
import Drizzle from "../Images/drizzle.png";
import Search from "../Images/search.png"
import Clearnight from "../Images/clearnight.png"
import Mist from "../Images/Mist.png"
import Thunderstorm from "../Images/thunderstorm.png"
function Weather() {
    const inputref = useRef();
    const [weatherdataa, setweatherdata] = useState(false);
    const [forecastdata, setforecastdata] = useState(null);
    const [selectedday, setselectedday] = useState(0); // 0 = tomorrow, 1 = day after tomorrow
    const allicon = {
        "01d": Clear,
        "01n": Clearnight,
        "02d": Cloud,
        "02n": Cloud,
        "03d": Cloud,
        "03n": Cloud,
        "04n": Drizzle,
        "04d": Drizzle,
        "09n": Rain,
        "09d": Rain,
        "10n": Rain,
        "10d": Rain,
        "11d":Thunderstorm,
        "11n":Thunderstorm,
        "13n": Snow,
        "13d": Snow,
        "50d":Mist,
        "50n":Mist
    };

    const search = async (city) => {

        if (city === "") {
            alert("Enter a City name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_API_KEY}&units=metric`;
            const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}&units=metric`;
            const response = await fetch(url);
            const forecastres = await fetch(forecasturl);
            
            const data = await response.json();
            const forecastdata = await forecastres.json();
            
            if (!response.ok) {
                alert(data.message);
                return;
            }
            console.log(data);
            console.log(forecastdata);
            const icon = allicon[data.weather[0].icon] || Clear;
            setweatherdata({
                humidity: data.main.humidity,
                winspeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                temp_max: Math.floor(data.main.temp_max),
                temp_min: Math.floor(data.main.temp_min),
                location: data.name,
                icon: icon,
                description:data.weather[0].description
            })

            // Extract tomorrow and day after tomorrow (first weather of each day)
            const forecast = [];
            const uniqueDates = new Set();
            const today = new Date().toLocaleDateString('en-CA');
            
            for (let item of forecastdata.list) {
                const date = new Date(item.dt * 1000);
                const dateKey = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format for consistency
                
                // Skip today's date and add only first entry of each future date
                if (dateKey !== today && !uniqueDates.has(dateKey) && forecast.length < 2) {
                    uniqueDates.add(dateKey);
                    const forecasticon = allicon[item.weather[0].icon] || Clear;
                    forecast.push({
                        temperature: Math.floor(item.main.temp),
                        temp_max: Math.floor(item.main.temp_max),
                        temp_min: Math.floor(item.main.temp_min),
                        humidity: item.main.humidity,
                        winspeed: item.wind.speed,
                        icon: forecasticon,
                        description: item.weather[0].description,
                        date: dateKey
                    });
                }
            }
            setforecastdata(forecast);
            setselectedday(0);
            console.log("Forecast data extracted:", forecast);
        } catch (error) {
            setweatherdata(false);
            console.error("error in fetching weather data");
        }
    }

    useEffect(() => {
        search("Bengaluru");
    }, [])
    return (

        
            <div className="weather">
            <div className="top">
                <h1>Weather App</h1>
                <img src={Drizzle} alt="weatherimage"></img>
            </div>
                
                <div className="search">
                    <input type="text" ref={inputref} placeholder="Search"></input>
                    <img src={Search} onClick={() => search(inputref.current.value)} alt="weatherimage"></img>
                </div>
                {weatherdataa ? <>
                    <div className="icon">
                        <img src={weatherdataa.icon} alt="weather"></img>
                    </div>
                    <p className="temperature">{weatherdataa.temperature}ºC</p>
                    <p className="temp-range">H: {weatherdataa.temp_max}ºC L: {weatherdataa.temp_min}ºC</p>
                    <p className="Location">{weatherdataa.location}</p>
                    <p className="description">{weatherdataa.description}</p>
                    <div className="weatherdata">
                        <div className="col">
                            <img src={Humidity_icon} alt="weatherimage"></img>
                            <div>
                                <p>{weatherdataa.humidity}%</p>
                                <span>Humidity</span>
                            </div>

                        </div>
                        <div className="col">
                            <img src={Wind} alt="weatherimage"></img>
                            <div>
                                <p>{weatherdataa.winspeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>

                    {/* Forecast Buttons */}
                    {forecastdata && forecastdata.length > 0 && (
                        <div className="forecast-buttons">
                            <button 
                                className={`forecast-btn ${selectedday === 0 ? 'active' : ''}`}
                                onClick={() => setselectedday(0)}
                            >
                                Tomorrow
                            </button>
                            {forecastdata.length > 1 && (
                                <button 
                                    className={`forecast-btn ${selectedday === 1 ? 'active' : ''}`}
                                    onClick={() => setselectedday(1)}
                                >
                                    Day After Tomorrow
                                </button>
                            )}
                        </div>
                    )}

                    {/* Forecast Panel */}
                    {forecastdata && forecastdata[selectedday] && (
                        <div className="forecast-panel" key={`forecast-${selectedday}`}>
                            <p className="forecast-date">{new Date(forecastdata[selectedday].date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <div className="forecast-icon">
                                <img key={`icon-${selectedday}-${forecastdata[selectedday].icon}`} src={forecastdata[selectedday].icon} alt="forecast weather"></img>
                            </div>
                            <p className="forecast-temperature">{forecastdata[selectedday].temperature}ºC</p>
                            <p className="forecast-temp-range">H: {forecastdata[selectedday].temp_max}ºC L: {forecastdata[selectedday].temp_min}ºC</p>
                            <p className="forecast-description">{forecastdata[selectedday].description}</p>
                            <div className="forecast-data">
                                <div className="forecast-col">
                                    <img src={Humidity_icon} alt="humidity"></img>
                                    <div>
                                        <p>{forecastdata[selectedday].humidity}%</p>
                                    </div>
                                </div>
                                <div className="forecast-col">
                                    <img src={Wind} alt="wind"></img>
                                    <div>
                                        <p>{forecastdata[selectedday].winspeed} Km/h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </> : <></>}
            </div>
        
    );
}

export default Weather;