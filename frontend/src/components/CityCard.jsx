function getScoreColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  if (score >= 30) return '#f97316';
  return '#ef4444';
}

function getScoreLabel(score) {
  if (score >= 70) return 'Excellent';
  if (score >= 50) return 'Good';
  if (score >= 30) return 'Fair';
  return 'Poor';
}

function CityCard({ city, rank }) {
  const scoreColor = getScoreColor(city.comfortScore);
  const scoreLabel = getScoreLabel(city.comfortScore);
  const isTop3 = rank <= 3;

  return (
    <article className={`city-card ${isTop3 ? 'city-card--top' : ''}`}>
      {/* Rank Badge */}
      <div className="card-rank" style={{ '--rank-color': scoreColor }}>
        #{rank}
        {rank === 1 && <span className="rank-crown">👑</span>}
      </div>

      {/* Header */}
      <div className="card-header">
        <img
          className="weather-icon"
          src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
          alt={city.description}
          loading="lazy"
        />
        <div className="card-title">
          <h3 className="city-name">{city.name}</h3>
          <span className="city-country">{city.country}</span>
        </div>
        <div
          className="score-badge"
          style={{ background: scoreColor + '22', color: scoreColor, border: `1px solid ${scoreColor}55` }}
        >
          <span className="score-num">{city.comfortScore}</span>
          <span className="score-label-badge">{scoreLabel}</span>
        </div>
      </div>

      {/* Description */}
      <p className="weather-desc">{city.description}</p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-icon">🌡️</span>
          <span className="stat-value">{city.temperature}°C</span>
          <span className="stat-key">Temp</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💧</span>
          <span className="stat-value">{city.humidity}%</span>
          <span className="stat-key">Humidity</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💨</span>
          <span className="stat-value">{city.windSpeed} m/s</span>
          <span className="stat-key">Wind</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">☁️</span>
          <span className="stat-value">{city.cloudiness}%</span>
          <span className="stat-key">Cloud</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👁️</span>
          <span className="stat-value">{(city.visibility / 1000).toFixed(1)} km</span>
          <span className="stat-key">Visibility</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🌡️</span>
          <span className="stat-value">{city.feelsLike}°C</span>
          <span className="stat-key">Feels Like</span>
        </div>
      </div>

      {/* Comfort Score Bar */}
      <div className="comfort-bar-wrapper">
        <div className="comfort-bar-header">
          <span>Comfort Score</span>
          <span style={{ color: scoreColor }}>{city.comfortScore}/100</span>
        </div>
        <div className="comfort-bar-track">
          <div
            className="comfort-bar-fill"
            style={{ width: `${city.comfortScore}%`, background: scoreColor }}
          />
        </div>
      </div>

      {/* Score Breakdown */}
      <details className="breakdown">
        <summary>Score Breakdown</summary>
        <div className="breakdown-grid">
          {Object.entries(city.breakdown).map(([key, val]) => (
            <div key={key} className="breakdown-item">
              <span className="bd-key">{key}</span>
              <div className="bd-bar-track">
                <div className="bd-bar-fill" style={{ width: `${val}%`, background: scoreColor }} />
              </div>
              <span className="bd-val">{val}</span>
            </div>
          ))}
        </div>
      </details>
    </article>
  );
}

export default CityCard;
