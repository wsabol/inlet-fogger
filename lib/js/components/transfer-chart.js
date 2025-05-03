import React from 'react';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export default class TransferChart extends React.PureComponent {
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
                        label={{value: 'Transfer Rate', angle: -90, position: 'insideLeft'}}
                    />
                    <Tooltip/>
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey="heatTransfer"
                        name="Heat Transfer"
                        stroke="#0000ff"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="massTransfer"
                        name="Mass Transfer"
                        stroke="#ff0000"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}
