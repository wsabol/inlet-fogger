import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export default class HumidityChart extends React.PureComponent {
    render() {
        const { data } = this.props;
        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                        yAxisId="left"
                        label={{ value: 'Droplet Diameter (µm)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="dropletDiameter"
                        name="Droplet Diameter"
                        stroke="#0000ff"
                        dot={false}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="relativeHumidity"
                        name="Relative Humidity"
                        stroke="#ff0000"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
