import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export default class TemperatureChart extends React.PureComponent {
    generateTicks(num) {
        const end = Math.floor(10 * num);
        const result = [];
        for (let x = 0; x <= end; x++) {
            result.push(parseFloat((x * 0.1).toFixed(1)));
        }
        return result;
    }

    render() {
        const { data } = this.props;
        const dataLength = data.length
        const maxTime = data[dataLength - 1].time

        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        ticks={this.generateTicks(maxTime)}
                        tickFormatter={(v, i) => Number(v).toFixed(2)}
                        label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                        domain={['auto', 'auto']}
                        tickFormatter={(v, i) => v.toFixed(0)}
                        label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="airTemp"
                        name="Air Temperature"
                        stroke="#ff0000"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="dropletTemp"
                        name="Droplet Temperature"
                        stroke="#0000ff"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
