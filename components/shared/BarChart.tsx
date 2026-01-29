import React from 'react';

interface BarChartProps {
    title: string;
    data: { label: string; value: number }[];
    color: string;
}

const BarChart: React.FC<BarChartProps> = ({ title, data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    const description = `${title}. ${data.map(d => `${d.label}: ${d.value}`).join(', ')}.`;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg" role="img" aria-label={description}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4" aria-hidden="true">{title}</h3>
            <div className="flex justify-between items-end h-64 space-x-2">
                {data.map(item => (
                    <div key={item.label} className="flex-1 flex flex-col items-center justify-end">
                        <div 
                            className={`w-full ${color} rounded-t-md transition-all duration-500 ease-out`}
                            style={{ height: `${(item.value / (maxValue || 1)) * 100}%` }}
                            title={`${item.label}: ${item.value}`}
                            aria-hidden="true"
                        ></div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate" aria-hidden="true">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BarChart;