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
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
                return;
            }
            console.log(data);
            const icon = allicon[data.weather[0].icon] || Clear;
            setweatherdata({
                humidity: data.main.humidity,
                winspeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
                description:data.weather[0].description
            })
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
                    </div></> : <></>}
            </div>
        


    );
}

export default Weather;