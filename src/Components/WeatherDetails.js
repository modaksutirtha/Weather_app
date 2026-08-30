import React from 'react';

function WeatherDetails({ data, forecast }) {
  if (!data) return null;

  const formatTimeIST = (ts) =>
    new Date(ts * 1000).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

  const formatDateIST = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Kolkata',
    });

  return (
    <div className="weather-details">
      <h3>Full Details</h3>
      <div className="details-grid">
        <div className="detail-item"><span className="label">Feels Like:</span> <span className="value">{Math.round(data.main.feels_like)}°C</span></div>
        <div className="detail-item"><span className="label">Pressure:</span> <span className="value">{data.main.pressure} hPa</span></div>
        <div className="detail-item"><span className="label">Visibility:</span> <span className="value">{data.visibility ?? 'N/A'} m</span></div>
        <div className="detail-item"><span className="label">Cloudiness:</span> <span className="value">{data.clouds?.all ?? 'N/A'}%</span></div>
        <div className="detail-item"><span className="label">Weather:</span> <span className="value">{data.weather?.[0]?.main} — {data.weather?.[0]?.description}</span></div>
        <div className="detail-item"><span className="label">Coordinates:</span> <span className="value">{data.coord?.lat}, {data.coord?.lon}</span></div>
        <div className="detail-item"><span className="label">Wind Deg:</span> <span className="value">{data.wind?.deg ? `${data.wind.deg}°` : 'N/A'}</span></div>
        <div className="detail-item"><span className="label">Wind Gust:</span> <span className="value">{data.wind?.gust ?? 'N/A'}</span></div>
        <div className="detail-item"><span className="label">Sunrise (IST):</span> <span className="value">{data.sys?.sunrise ? formatTimeIST(data.sys.sunrise) : 'N/A'}</span></div>
        <div className="detail-item"><span className="label">Sunset (IST):</span> <span className="value">{data.sys?.sunset ? formatTimeIST(data.sys.sunset) : 'N/A'}</span></div>
        <div className="detail-item"><span className="label">Timezone:</span> <span className="value">UTC{data.timezone ? (data.timezone >= 0 ? '+' : '') + (data.timezone/3600) : 'N/A'}</span></div>
      </div>

      {forecast && forecast.length > 0 && (
        <div className="forecast-details">
          <h4>Upcoming Days</h4>
          <div className="forecast-list">
            {forecast.map((f, i) => (
              <div key={i} className="forecast-item">
                <div className="f-date">{formatDateIST(f.date)}</div>
                <div className="f-range">H: {f.temp_max}° L: {f.temp_min}°</div>
                <div className="f-desc">{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherDetails;
