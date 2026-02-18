import React from 'react';

const WeatherCard = ({ city, rank }) => {
    const {
        name,
        country,
        description,
        icon,
        temperature,
        humidity,
        windSpeed,
        comfortScore,
        breakdown,
    } = city;

    // Determine card color based on score
    const getScoreColor = (score) => {
        if (score >= 80) return 'border-l-4 border-green-500';
        if (score >= 60) return 'border-l-4 border-yellow-500';
        return 'border-l-4 border-red-500';
    };

    return (
        <div className={`bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-4 transition transform hover:scale-105 ${getScoreColor(comfortScore)}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        #{rank} {name}, {country}
                    </h2>
                    <p className="text-gray-500 capitalize">{description}</p>
                </div>
                <div className="flex flex-col items-end">
                    <img
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        alt={description}
                        className="w-12 h-12"
                    />
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        {temperature}°C
                    </span>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Comfort Score</span>
                    <span className="text-lg font-bold text-blue-600">{comfortScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${comfortScore}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div>Humidity: {humidity}%</div>
                <div>Wind: {windSpeed} m/s</div>
                <div>Clouds: {breakdown.cloudiness}/100</div>
                <div>Visibility: {breakdown.visibility}/100 pts</div>
            </div>
        </div>
    );
};

export default WeatherCard;
