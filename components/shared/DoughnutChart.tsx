import React from 'react';

interface DoughnutChartProps {
    title: string;
    data: { label: string; value: number }[];
    colors: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ title, data, colors }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;
    const description = `${title}. ${data.map(d => `${d.label}: ${d.value.toLocaleString()}`).join(', ')}.`;

    const slices = data.map((item, index) => {
        const percent = item.value / total;
        const startAngle = (cumulativePercent * 2 * Math.PI);
        cumulativePercent += percent;
        const endAngle = (cumulativePercent * 2 * Math.PI);
        
        const getCoord = (angle: number, radius: number) => ({
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle),
        });

        const startOuter = getCoord(startAngle, 40);
        const endOuter = getCoord(endAngle, 40);
        const startInner = getCoord(startAngle, 25);
        const endInner = getCoord(endAngle, 25);
        
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        
        const pathData = [
            `M ${startOuter.x} ${startOuter.y}`,
            `A 40 40 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
            `L ${endInner.x} ${endInner.y}`,
            `A 25 25 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
            'Z'
        ].join(' ');
        
        return { path: pathData, color: colors[index % colors.length] };
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg h-full" role="img" aria-label={description}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4" aria-hidden="true">{title}</h3>
            <div className="flex flex-col md:flex-row items-center justify-center" aria-hidden="true">
                 <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
                    {slices.map((slice, index) => (
                        <path key={index} d={slice.path} fill={slice.color} />
                    ))}
                </svg>
                <div className="md:ml-6 mt-4 md:mt-0 space-y-2 text-sm w-full md:w-auto">
                    {data.map((item, index) => (
                        <div key={item.label} className="flex items-center justify-between md:justify-start">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
                                <span className="text-gray-600 dark:text-gray-400">{item.label}:</span>
                            </div>
                            <span className="font-semibold ml-1 text-gray-800 dark:text-gray-200">{item.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoughnutChart;