import './style.css';

import ApexCharts from 'apexcharts';

var options = {
  chart: {
    type: 'line',
    animations: {
      enabled: false
    },
    zoom: {
      enabled: false // disable zooming because of Safari bug
    }
  },
  series: [{
    name: 'sales',
    data: [30,40,35,50,49,60,70,91,125]
  }],
  xaxis: {
    categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
  },
  theme: {
    mode: 'dark' 
  }
}

var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();