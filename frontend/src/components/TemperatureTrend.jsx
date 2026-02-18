import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine } from 'recharts';

const TemperatureTrend = ({ cities }) => {
    // Prepare data: Extract name and temperature
    const data = cities.map(city => ({
        name: city.name,
        temp: city.temperature,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 transition-colors duration-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Temperature Overview</h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            stroke="#8884d8"
                            tick={{ fill: 'currentColor' }}
                            className="text-gray-600 dark:text-gray-400"
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            stroke="#8884d8"
                            tick={{ fill: 'currentColor' }}
                            className="text-gray-600 dark:text-gray-400"
                            padding={{ top: 20, bottom: 20 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#374151' }}
                            cursor={{ fill: 'transparent' }}
                        />
                        <ReferenceLine y={0} stroke="#9ca3af" />
                        <Bar dataKey="temp" name="Temperature (°C)">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.temp > 25 ? '#ef4444' : entry.temp < 10 ? '#3b82f6' : '#10b981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TemperatureTrend;
