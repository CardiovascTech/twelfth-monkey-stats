import './style.css';
import ApexCharts from 'apexcharts';
import Papa from 'papaparse'

const API_URL = 'https://stats-api.twelfth-monkey.com/';
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || '813a705b-3132-4f18-a5e7-031e9437d0ea';
const legLength = .5; //this is the length of the leg in kilometers for the current event. will need to be updated once we include this is a variable in the event data. 
const finishDistance = 25 // this is the overall length of the race for the whole team in kms. 




fetch(`${API_URL}${id}`).then(res => res.json()).then(data => {
  const { distance, eventData } = data;


  const totalDistanceByTeam = eventData.reduce((acc, { teamName, timeFinished }) => {
    if (!acc[teamName]) {
      acc[teamName] = 0;
    }
    acc[teamName] += distance;
    return acc;
  });

  const teamNames = new Set(eventData.map(({ teamName }) => teamName));
  const seriesByTeam = Array.from(teamNames).map(teamName => ({
    name: teamName,
    // Sum the distance values for the team and wrap it in an array to conform to the expected data structure
    data: [totalDistanceByTeam[teamName]]
  }));
  

  // now we need to create a new object that will store the cumulative distance data by date, by team.
  const distanceDataByTeam = {};

  // use the teamNames set to store the unique team names as keys in the object, initialize the value as an empty array
  teamNames.forEach(teamName => {
    distanceDataByTeam[teamName] = [];
  });

  // for each eventData item, push the date and cumulative distance to the array for the team in the object
  eventData.forEach(({ teamName, timeFinished }) => {
    const lastDistanceIndex = distanceDataByTeam[teamName].length - 1;
    const lastDistance = lastDistanceIndex >= 0 ? distanceDataByTeam[teamName][lastDistanceIndex][1] : 0;
    const cumulativeDistance = lastDistance + distance;
    distanceDataByTeam[teamName].push([new Date(timeFinished).getTime(), cumulativeDistance]);
  });



  // data.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()).forEach(event => {
  //   teamNames.add(event.team);
  //   distanceDataByTeam[event.team] = distanceDataByTeam[event.team] || [];
  //   // Set each event's distance to 10m directly without cumulative addition
  //   distanceDataByTeam[event.team].push([new Date(event.start_date).getTime(), 10]);
  // });
  console.log('distanceDataByTeam');
  console.log(distanceDataByTeam);
  

  const seriesByDate = Array.from(teamNames).map(team => ({
    name: team,
    data: distanceDataByTeam[team]
  }));

  // Chart options
  const optionsByTeam = {
    chart: {
        type: 'bar',
        background: 'black',

    },
    grid: {
      padding: {
        top: 20,
        right: 70,
        bottom: 20,
        left: 20
      }
    },
    series: seriesByTeam,
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    theme: {
      mode: 'dark'
    },
    annotations: {
      yaxis: [{
          y: finishDistance,
          borderColor: 'red',
          strokeWidth: 10,
          label: {
              borderColor: 'red',
              style: {
                  color: 'white',
                  background: 'red',
              },
              text: 'FINISH'
          }
      }],
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['Teams'], // Adjust based on your data or requirements
    },
    yaxis: {
        title: {
            text: 'Kms'
        },
        max: finishDistance,
        min: 0,
    },
    
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + " kms"
            }
        }
    },
    responsive: [{
      breakpoint: 1000,
      options: {
      
        xaxis: {
          labels: {
            style: {
              fontSize: '20px',
              
            }
          },
        },
        yaxis: {
          max: finishDistance,
          min: 0,
          labels: {
            style: {
              fontSize: '20px'
            }
          },
            title: {
              text: 'Distance (km)',
              style: {

              fontSize: '20px',
              },
            },

        },
        max: 1000,
        min: 0,
        markers: {
          size: 10
        },
        legend: {
          fontSize: '20px',
          
        },
      },
    }]
  };

  const optionsByDate = {
    chart: {
      type: 'line',
      animations: {
        enabled: false
      },
      zoom: {
        enabled: false // disable zooming because of Safari bug
      },
      background: 'black',
    },
    grid: {
      padding: {
        top: 20,
        right: 70,
        bottom: 20,
        left: 20
      }
    },
    xaxis: {
      type: 'datetime',
        labels: {
          format: 'dd/MM/yyyy',
          // Optionally, specify the formatter function for more complex scenarios
        },
        // Additional xaxis configurations...
      },
      yaxis: {
        title: {
            text: 'Kms'
        },
        max: finishDistance,
        min: 0,
        decimalsInFloat: 1,
    },
    series: seriesByDate,
    theme: {
      mode: 'dark'
    },
    legend: {
      show: true, 
      position: 'bottom',
    },
    tooltip: {
      x: {
        format: 'dd MM yyyy'
      },
      y: {
        formatter: function (value) {
          return value.toFixed(2) + ' km';
        }
      },
      style: {
        fontSize: '11px'
      }
    },
    markers: {
      size: 5,
    },
  
    annotations: {
      yaxis: [{
          y: finishDistance,
          borderColor: 'red',
          strokeWidth: 10,
          label: {
              borderColor: 'red',
              style: {
                  color: 'white',
                  background: 'red',
              },
              text: 'FINISH'
          }
      }],
      zIndex: 3, // This will draw the annotations on top of the grid lines
  
    },
    responsive: [{
      breakpoint: 1000,
      options: {
        xaxis: {
          labels: {
            style: {
              fontSize: '30px'
            }
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '20px'
            },
  
          },
          title: {
            text: 'Distance (km)',
            style: {

            fontSize: '20px',
            },
          },
          max: finishDistance,
          min: 0,
        },

        legend: {
          fontSize: '20px',
          
        },
        markers: {
          size: 10
        }
      }
    }]
  };
  

  // Initialize chart
  var chart3 = new ApexCharts(document.querySelector("#chartByTeam"), optionsByTeam);
  chart3.render();
  // Render the line chart
  var chart = new ApexCharts(document.querySelector("#chartByDate"), optionsByDate);
  chart.render();


});
