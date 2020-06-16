  import * as React from 'react';
import { Chart } from 'chart.js'; 
export default  class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidUpdate() {
    console.log("Compontent");
    console.log(this.props.data);
    this.myChart.data.labels = this.props.data.map(d => d.data.time);
    this.myChart.data.datasets[0].data = this.props.data.map(d => d.data.value);
    console.log( ">>>");
    console.log(   this.myChart.data.datasets[0].label);
    this.myChart.data.datasets[0].label = this.props.title;
    this.myChart.update();
  }

  componentDidMount() {
    this.myChart = new Chart(this.chartRef.current, {
      type: 'bar',
      
      data: {
        labels: this.props.data.map(d => d.time),
        datasets: [{
          label: this.props.title,
          data: this.props.data.map(d => d.value),
          fill: 'none',
          backgroundColor: this.props.color,
          pointRadius: 2,
          borderColor: this.props.color,
          borderWidth: 1,
          lineTension: 0
        }]
      }
    });
  }

  render() {
    return <canvas ref={this.chartRef} />;
  }
}; 