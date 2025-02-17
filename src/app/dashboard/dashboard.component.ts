import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { MatTabChangeEvent } from '@angular/material/tabs';

declare var App: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public sc_fb: string = App.public_url + 'signatures/assets/images/sc_fb.svg';
  public sc_twit: string = App.public_url + 'signatures/assets/images/sc_twit.svg';
  public sc_pint: string = App.public_url + 'signatures/assets/images/sc_pint.svg';
  public sc_adwords: string = App.public_url + 'signatures/assets/images/sc_adwords.svg';

  public chart1: string = App.public_url + 'signatures/assets/images/chart_1.png';
  public chart2: string = App.public_url + 'signatures/assets/images/chart_2.png';
  
  public tbl_fb: string = App.public_url + 'signatures/assets/images/tbl_fb.svg';
  public tbl_twit: string = App.public_url + 'signatures/assets/images/tbl_twit.svg';
  public tbl_pint: string = App.public_url + 'signatures/assets/images/tbl_pint.svg';

  public org_fb: string = App.public_url + 'signatures/assets/images/org_fb.svg';
  public org_twit: string = App.public_url + 'signatures/assets/images/org_twit.svg';

  public sc_fb_circle: string = App.public_url + 'signatures/assets/images/sc_fb_circle.svg';
  public sc_twit_circle: string = App.public_url + 'signatures/assets/images/sc_twit_circle.svg';

  public graph_icon: string = App.public_url + 'signatures/assets/images/graph_icon.svg';

  dashboardForm: FormGroup;
  projectList: Array<object> = [
    { id: 1, value: 'HLMS - Sprint' },
    { id: 2, value: 'HLMS - Summer' },
    { id: 3, value: 'HLMS - Fall' },
    { id: 4, value: 'HLMS - Winter' },
  ];
  objectiveList: Array<object> = [
    { id: 1, value: 'Increase Website Traffic' },
    { id: 2, value: 'Increase Awareness' },
    { id: 3, value: 'Black Friday Sales' }
  ];
  campaignList: Array<object> = [
    { id: 1, value: 'July 2017 Data Test' },
    { id: 2, value: 'August 2017 Data Test' }
  ];

  //user_roles_permissions: Object;

  dataList: Array<any> = [];
  dataset0: Array<any> = [0, 5, 0, 5, 15, 0, 2, 8, 5, 0, 30, 0, 5, 2, 0];
  dataset1: Array<any> = [0, 5, 0, 5, 10, 0, 2, 8, 5, 0, 40, 0, 5, 2, 0];
  dataset2: Array<any> = [0, 5, 0, 5, 35, 0, 2, 8, 5, 0, 4, 0, 5, 2, 0];
  
  constructor(
    private titleService: Title,
    private fb: FormBuilder,
    private router: Router) { 
    
  }

  ngOnInit() {
    this.titleService.setTitle(App['company_data'].mainTitle);
    this.createForm();

    //this.user_roles_permissions = App.user_roles_permissions;
    //console.log(this.user_roles_permissions1);

    /*Clicks vs Conversions chart*/
    var pie_chart_0 = document.getElementById("pie_chart_0");

    var pie_chart_0 = new Chart(pie_chart_0, {
        type: 'doughnut',
        data: {
            labels: ["Impressions", "Conversions"],
            datasets: [{
                label: "Impressions",
                data: [75, 25],
                backgroundColor: ["#585EC0", "#C8477F"],
                borderColor:"#2B3556",
                fill: false,
                borderWidth: 2,
                pointBorderWidth: 0,
                pointHoverRadius: 0,
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
    
    /* Google analytics chart */
    var line_chart_3 = document.getElementById("line_chart_3");
    
      var line_chart_3 = new Chart(line_chart_3, {
        type: 'line',
        data: {
            labels: ["Oct 14", "Oct 20", "oct 25", "Oct 30", "Nov 5"],
            datasets: [{
                label: "",
                data: [20, 200, 50, 350, 50],
                backgroundColor: "#7b8cdf",
                borderColor: "#7b8cdf",
                fill: false,
                borderWidth: 5,
                pointBorderWidth: 0,
                pointHoverRadius: 7,
                pointHoverBorderWidth: 0,
                pointRadius: 5,
                pointHitRadius: 0,
                pointBackgroundColor:'#ffd047'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display:false
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
                    },
                    ticks: {
                        beginAtZero:true
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false
                    },
                    gridLines:{
                        color: "#7b8cdf"
                    },
                    ticks: {
                      beginAtZero:true,
                      fontSize: 10,
                      fontColor: '#cdd4f2',
                      callback: function(value, index, values) {
                          return value + 'M';
                      }
                    }
                }]
            }
        }
      });


  }

  ngAfterViewInit() {
   // setTimeout(()=>{
       //this.dataList = [this.dataset0, this.dataset1, this.dataset2];
        /*this.dataList.forEach(function(list, index){
            new Chart('line_chart_' + index, {*/

    /* facebook chart*/    
    var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('line_chart_0');
    var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

    var gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(79,86,169,1)');   
    gradient.addColorStop(1, 'rgba(79,86,169,0)');

    var gradient1 = ctx.createLinearGradient(0, 0, 0, 200);
    gradient1.addColorStop(0, 'rgba(195, 73, 125,1)');   
    gradient1.addColorStop(1, 'rgba(195, 73, 125,0)');

    //var line_chart_0 = document.getElementById("line_chart_0").getContext("2d");
    var line_chart_0 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["Oct 14", "Oct 20", "oct 25", "Oct 30", "Nov 5", "Nov 22"],
            datasets: [{
                label: "CPM",
                data: [100, 400, 200, 400, 300, 500],
                backgroundColor: gradient1,
                borderColor:'#b5477a',
                fill: 'origin',
                borderWidth: 2,
                pointBorderWidth: 0,
                pointHoverRadius: 2,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                pointHitRadius: 0
            }, {
                label: "CPP",
                data: [150, 300, 250, 500, 320, 440],
                backgroundColor: gradient,
                borderColor:'#5359b2',
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
            datasetStrokeWidth : 3,
            pointDotStrokeWidth : 4,
            legend: {
                display:false
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines : {
                    color: "#404763"
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
                    gridLines : {
                        color: "#404763"
                    }
                }]
            },
            plugins: {
                filler: {
                    propagate: false
                },
                samples_filler_analyser: {
                    target: 'chart-analyser'
                }
            }

        }
    });

    
    //});
    //},500);
  }

  createForm(): void {
    this.dashboardForm = this.fb.group({
      projects: [null],
      objectives: [null],
      campaigns: [null],
      date_range: [null]
    })
  }

  fbStats(): void {
    this.router.navigate(['./dashboard-stats']);
  }

  twitterStats(): void {
    this.router.navigate(['./twitter-stats']);
  }

  onLinkClick(event: MatTabChangeEvent) {
    if(event.index == 0){

        /* facebook chart*/    
        var canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('line_chart_0');
        var ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        var gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79,86,169,1)');   
        gradient.addColorStop(1, 'rgba(79,86,169,0)');

        var gradient1 = ctx.createLinearGradient(0, 0, 0, 200);
        gradient1.addColorStop(0, 'rgba(195, 73, 125,1)');   
        gradient1.addColorStop(1, 'rgba(195, 73, 125,0)');

        var line_chart_0 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["Oct 14", "Oct 20", "oct 25", "Oct 30", "Nov 5", "Nov 22"],
                datasets: [{
                    label: "CPM",
                    data: [100, 400, 200, 400, 300, 500],
                    backgroundColor: gradient1,
                    borderColor:'#b5477a',
                    fill: 'origin',
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointHoverRadius: 2,
                    pointHoverBorderWidth: 0,
                    pointRadius: 0,
                    pointHitRadius: 0
                }, {
                    label: "CPP",
                    data: [150, 300, 250, 500, 320, 440],
                    backgroundColor: gradient,
                    borderColor:'#5359b2',
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
                datasetStrokeWidth : 3,
                pointDotStrokeWidth : 4,
                legend: {
                    display:false
                },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines : {
                        color: "#404763"
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
                        gridLines : {
                            color: "#404763"
                        }
                    }]
                },
                plugins: {
                    filler: {
                        propagate: false
                    },
                    samples_filler_analyser: {
                        target: 'chart-analyser'
                    }
                }

            }
        });
    }
    else if(event.index == 1){
        var canvas_twit: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('line_chart_1');
        var ctx_twit: CanvasRenderingContext2D = canvas_twit.getContext("2d");
        
        var gradient = ctx_twit.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79,86,169,1)');   
        gradient.addColorStop(1, 'rgba(79,86,169,0)');
    
        var gradient1 = ctx_twit.createLinearGradient(0, 0, 0, 200);
        gradient1.addColorStop(0, 'rgba(195, 73, 125,1)');   
        gradient1.addColorStop(1, 'rgba(195, 73, 125,0)');

        var line_chart_1 = new Chart(ctx_twit, {
            type: 'line',
            data: {
                labels: ["Oct 14", "Oct 20", "oct 25", "Oct 30", "Nov 5", "Nov 22"],
                datasets: [{
                    label: "CPM",
                    data: [100, 200, 150, 400, 300, 500],
                    backgroundColor: gradient1,
                    borderColor:'#b5477a',
                    fill: 'origin',
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointHoverRadius: 2,
                    pointHoverBorderWidth: 0,
                    pointRadius: 0,
                    pointHitRadius: 0
                }, {
                    label: "CPP",
                    data: [150, 300, 250, 300, 400, 320],
                    backgroundColor: gradient,
                    borderColor:'#5359b2',
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
                datasetStrokeWidth : 3,
                pointDotStrokeWidth : 4,
                legend: {
                    display:false
                },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines : {
                        color: "#404763"
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
                        gridLines : {
                            color: "#404763"
                        }
                    }]
                },
                plugins: {
                    filler: {
                        propagate: false
                    },
                    samples_filler_analyser: {
                        target: 'chart-analyser'
                    }
                }
    
            }
        });
    }
    else{
        var canvas_pint: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('line_chart_2');
        var ctx_pint: CanvasRenderingContext2D = canvas_pint.getContext("2d");
        
        var gradient = ctx_pint.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79,86,169,1)');   
        // gradient.addColorStop(0.5, 'rgba(79,86,169,0.5)');   
        gradient.addColorStop(1, 'rgba(79,86,169,0)');
    
        var gradient1 = ctx_pint.createLinearGradient(0, 0, 0, 200);
        gradient1.addColorStop(0, 'rgba(195, 73, 125,1)');   
        // gradient1.addColorStop(0.5, 'rgba(195, 73, 125,0.5)');   
        gradient1.addColorStop(1, 'rgba(195, 73, 125,0)');
    
        //var line_chart_0 = document.getElementById("line_chart_0").getContext("2d");
        var line_chart_2 = new Chart(ctx_pint, {
            type: 'line',
            data: {
                labels: ["Oct 14", "Oct 20", "oct 25", "Oct 30", "Nov 5", "Nov 22"],
                datasets: [{
                    label: "CPM",
                    data: [200, 100, 300, 260, 400, 100],
                    backgroundColor: gradient1,
                    borderColor:'#b5477a',
                    fill: 'origin',
                    borderWidth: 2,
                    pointBorderWidth: 0,
                    pointHoverRadius: 2,
                    pointHoverBorderWidth: 0,
                    pointRadius: 0,
                    pointHitRadius: 0
                }, {
                    label: "CPP",
                    data: [220, 160, 350, 200, 320, 260],
                    backgroundColor: gradient,
                    borderColor:'#5359b2',
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
                datasetStrokeWidth : 3,
                pointDotStrokeWidth : 4,
                legend: {
                    display:false
                },
                scales: {
                    xAxes: [{
                            display: true,
                            gridLines : {
                            color: "#404763"
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
                        gridLines : {
                            color: "#404763"
                        }
                    }]
                },
                plugins: {
                    filler: {
                        propagate: false
                    },
                    samples_filler_analyser: {
                        target: 'chart-analyser'
                    }
                }
    
            }
        });
    }
  
  }


}
