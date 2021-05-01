import React from 'react';
import Chart from "react-apexcharts";

class LineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                chart: {height: 350,type: 'line',},
                dataLabels: {enabled: false},
                stroke: {curve: 'straight'},
                title: {text: this.props.name + ' Price',align: 'left'},
                grid: {row: {colors: ['#f3f3f3', 'transparent'], opacity: 0.5},},
                xaxis: {categories: this.props.labels,},
                },
            
            series: [{name: this.props.name,data: this.props.data}],
            };
        }
    componentDidMount(){
        this.setState({
            series: [{name: this.props.name,data: this.props.data}],
            options: {chart: {height: 350,type: 'line',},
                dataLabels: {enabled: false},
                stroke: {curve: 'straight'},
                title: {text: this.props.name + ' Price',align: 'left'},
                grid: {row: {colors: ['#f3f3f3', 'transparent'], opacity: 0.5},},
                xaxis: {categories: this.props.labels,}},
        });
    }

    render() {
        const options = this.state.options;
        const series = this.state.series;
        return (
            <div id="chart">
                <Chart options={options} series={series} type="line" height={350} />
            </div>);
    }
}
export default LineChart;