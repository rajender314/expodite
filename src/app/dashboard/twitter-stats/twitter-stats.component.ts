import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-twitter-stats',
  templateUrl: './twitter-stats.component.html',
  styleUrls: ['./twitter-stats.component.scss']
})
export class TwitterStatsComponent implements OnInit {

  dataList: Array<any> = [];
  dataset0: Array<any> = [0, 5, 0, 5, 15, 0, 2, 8, 5, 0, 30, 0, 5, 2, 0];
  dataset1: Array<any> = [0, 5, 0, 5, 10, 0, 2, 8, 5, 0, 40, 0, 5, 2, 0];
  dataset2: Array<any> = [0, 5, 0, 5, 35, 0, 2, 8, 5, 0, 4, 0, 5, 2, 0];
  dataset3: Array<any> = [0, 5, 0, 5, 15, 0, 2, 8, 5, 0, 30, 0, 5, 2, 0];
  dataset4: Array<any> = [0, 5, 0, 5, 35, 0, 2, 8, 5, 0, 4, 0, 5, 2, 0];
  dataset5: Array<any> = [0, 5, 0, 5, 15, 0, 2, 8, 5, 0, 30, 0, 5, 2, 0];
  
  constructor(private location: Location) { }

  ngOnInit() {
  
      var ctx = document.getElementById("conversion_trend_chart");
      var conversion_trend_chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Oct 14", "", "Oct 30", "", "Nov 13", ""],
          datasets: [{
              label: '',
              yAxisID: "y-axis-1",
              data: [120, 190, 30, 50, 20, 30],
              backgroundColor: '#5D9AEC',
              borderColor: '#5D9AEC',
              borderWidth: 1,
          },
          {
            label: '',
            yAxisID: "y-axis-2",
            data: [60, 150, 50, 80, 10, 40],
            backgroundColor: '#5D9AEC',
            borderColor: '#5D9AEC',
            borderWidth: 1,
        }]
        },
        options: {
          barThickness: 1,
          maintainAspectRatio: false,
          responsive: true,
          legend: {
              display: false,
          },
          title:{
              display:true,
              text:"Conversion Trend"
          },
          tooltips: {
              mode: 'index',
              intersect: true
          },
          scales: {
            xAxes: [{
                gridLines : {
                    display : false
                }
            }],
              yAxes: [{
                type: "linear", 
                display: true,
                position: "left",
                id: "y-axis-1",
                ticks: {
                  beginAtZero:true
              }
            }, {
                type: "linear", 
                display: true,
                position: "right",
                id: "y-axis-2",
                ticks: {
                    beginAtZero:true,
                    callback: function(value, index, values) {
                        return '$' + value;
                    }
                },
                gridLines: {
                    drawOnChartArea: false
                }
            }]

          }
      }
      });

/*Clicks vs Conversions chart*/
var pie_chart_0 = document.getElementById("pie_chart_0");

var pie_chart_0 = new Chart(pie_chart_0, {
    type: 'doughnut',
    data: {
        labels: ["Clicks", "Conversions"],
        datasets: [{
            label: "Clicks",
            data: [80, 20],
            backgroundColor: ["#1DA1F2", "#575DBE"],
            fill: false,
            borderWidth: 1,
            pointBorderWidth: 0,
            pointHoverRadius: 1,
            pointHoverBorderWidth: 0,
            pointRadius: 0,
            pointHitRadius: 0
        }]
    },
    options: {
        cutoutPercentage: 84,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display:false
        },
        hover: {
            mode: 'index'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
});      

    /*CPM_CPP chart*/
    var cpm_cpp_chart = document.getElementById("cpm_cpp_chart");
    
    var cpm_cpp_chart = new Chart(cpm_cpp_chart, {
      type: 'line',
      data: {
          labels: ["Oct 14", "", "Oct 20", "", "oct 25", "", "Oct 30", "", "Nov 5", "", "Nov 22"],
          datasets: [{
              label: "CPM",
              data: [2000, 3000, 2000, 4000, 5000, 3000, 4000, 7000, 6000, 7000, 9000],
              backgroundColor: "#53A8E2",
              borderColor: "#53A8E2",
              fill: false,
              borderWidth: 2,
              pointBorderWidth: 0,
              pointHoverRadius: 3,
              pointHoverBorderWidth: 0,
              pointRadius: 2,
              pointHitRadius: 0
          }, {
              label: "CPP",
              data: [1600, 2600, 1600, 3600, 4600, 2600, 3600, 6600, 5600, 6600, 8600],
              backgroundColor: "#7CBC87",
              borderColor: "#7CBC87",
              fill: false,
              borderWidth: 2,
              pointBorderWidth: 0,
              pointHoverRadius: 3,
              pointHoverBorderWidth: 0,
              pointRadius: 2,
              pointHitRadius: 0
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
              position: 'top',
          },
          hover: {
              mode: 'index'
          },
          scales: {
              xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true
                    },
                    gridLines : {
                        display : false
                    },
                    ticks: {
                        beginAtZero:true,
                        fontSize: 10,
                        fontColor: '#858585'
                    }
              }],
              yAxes: [{
                  display: true,
                  scaleLabel: {
                      display: true
                  },
                  ticks: {
                    beginAtZero:true,
                    fontSize: 10,
                    fontColor: '#858585',
                    callback: function(value, index, values) {
                        return '$' + value;
                    }
                  }
              }]
          }
      }
  });


  /*Impressions Reach Chart*/
  var imp_reach_chart = document.getElementById("imp_reach_chart");

  var imp_reach_chart = new Chart(imp_reach_chart, {
    type: 'line',
    data: {
        labels: ["Oct 14", "Oct 20", "oct 25", "Oct 30", "Nov 5"],
        datasets: [{
            label: "Impressions",
            data: [3000, 4000, 7000, 6000, 4000],
            backgroundColor: "#53A8E2",
            borderColor: "#53A8E2",
            fill: false,
            borderWidth: 2,
            pointBorderWidth: 0,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 0,
            pointRadius: 2,
            pointHitRadius: 0
        }, {
            label: "Reach",
            data: [2700, 3700, 6700, 5700, 3700],
            backgroundColor: "#7CBC87",
            borderColor: "#7CBC87",
            fill: false,
            borderWidth: 2,
            pointBorderWidth: 0,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 0,
            pointRadius: 2,
            pointHitRadius: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: 'top',
        },
        hover: {
            mode: 'index'
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true
                },
                gridLines : {
                  display : false
                },
                ticks: {
                    beginAtZero:true,
                    fontSize: 10,
                    fontColor: '#858585'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true
                },
                ticks: {
                  beginAtZero:true,
                  fontSize: 10,
                  fontColor: '#858585',
                  callback: function(value, index, values) {
                      return '$' + value;
                  }
                }
            }]
        }
    }
  });

  /*Reach Chart*/
  this.dataList = [this.dataset0, this.dataset1, this.dataset2, this.dataset3, 
      this.dataset4, this.dataset5];
  this.dataList.forEach(function(list, index){
      new Chart('reach_chart_' + index, {
          type: 'line',
          data: {
              labels: ["Oct 14", "", "oct 25", "", "Nov 5", "", "Nov 22", "", "Oct 14", "", "oct 25", "", "Nov 5", "", "Nov 22"],
              datasets: [{
                  label: "Reach",
                  data: list,
                  backgroundColor: "#CBE3FF",
                  borderColor: "#4C8AE8",
                  fill: 'origin',
                  borderWidth: 2,
                  pointBorderWidth: 0,
                  pointHoverRadius: 2,
                  pointHoverBorderWidth: 0,
                  pointRadius: 0,
                  pointHitRadius: 0
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              elements: {
                    line: {
                        tension: 0.000001
                    }
                },
              legend: {
                  display: false,
              },
              hover: {
                  mode: 'index'
              },
              scales: {
                    xAxes: [{
                        display: false,
                        scaleLabel: {
                            display: false
                        },
                        gridLines : {
                        display : false
                        }
                    }],
                    yAxes: [{
                        display: false,
                        scaleLabel: {
                            display: true
                        },
                        gridLines : {
                        display : false
                        },
                        ticks: {
                        beginAtZero:true
                        }
                    }]
                }
          }
      });
  });
  }

  go_back(): void{
      this.location.back();
  }

}
