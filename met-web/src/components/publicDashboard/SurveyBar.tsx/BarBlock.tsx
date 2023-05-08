import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { SurveyBarData } from '../types';
import { DASHBOARD } from '../constants';
import { Box, Theme, useMediaQuery } from '@mui/material';

interface BarBlockProps {
    data: SurveyBarData;
}
export const BarBlock = ({ data }: BarBlockProps) => {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    return (
        <Box marginLeft={{ xs: 0, sm: '2em' }} marginTop={'3em'}>
            <ResponsiveContainer width={'100%'} height={400} key={data.postion}>
                <BarChart
                    data={data.result}
                    layout="vertical"
                    key={data.postion}
                    margin={{ left: isSmallScreen ? 20 : 0 }}
                >
                    <XAxis hide axisLine={false} type="number" />
                    <YAxis
                        width={250}
                        dataKey="value"
                        type="category"
                        axisLine={true}
                        tickLine={true}
                        minTickGap={10}
                        tickMargin={10}
                    />
                    <Tooltip />
                    <Bar
                        dataKey="count"
                        stackId="a"
                        fill={DASHBOARD.BAR_CHART.FILL_COLOR}
                        minPointSize={2}
                        barSize={32}
                    >
                        <LabelList dataKey="count" position="insideRight" style={{ fill: 'white' }} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};