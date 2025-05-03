import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export default class DensityChart extends React.PureComponent {
    render() {
        const { data } = this.props;
        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                        dataKey="time"
                        label={{value: 'Time (s)', position: 'insideBottomRight', offset: -5}}
                    />
                    <YAxis
                        label={{value: 'Density (kg/m^3)', angle: -90, position: 'insideLeft'}}
                    />
                    <Tooltip/>
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey="density"
                        name="Air Density"
                        stroke="#0000ff"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
