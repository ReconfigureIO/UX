/* --------------------------------------------------------------
   Comparison Chart
-------------------------------------------------------------- */
var chart = {

  chart              : '',
  chartContainer     : $("#comparison-chart"),
  chartTrigger       : $(".comparison-chart__control__item"),

  init : function() {
    this.bindUI();
  },

  bindUI: function() {

    // Create chart
    if(chart.chartContainer.length) {
      chart.initChart();

      chart.chartTrigger.on('click', function(event) {
        chart.chartTrigger.removeClass('active');
        $(this).addClass('active');
        chart.updateChartValues($(this).data('stats'));
        event.preventDefault();
      });
    }

  },

  initChart: function() {
    var data = {
      labels: ['Performance / €', 'Performance / Watt', 'Flexibility', 'Scalability', 'Future prospect'],
      datasets: [{
        data: [1, 3, 5, 4, 3],
        backgroundColor: '#23C389',
        borderColor: '#23C389',
        pointBackgroundColor: 'rgab(0,0,0,0)',
        pointStyle: ''
      }]
    };
    var options = {
      animation: {
        duration: 500
      },
      legend: {
        display: false
      },
      title: {
        display: false,
      },
      tooltips: {
        enabled: false
      },
      scale: {
        ticks: {
          display: false,
          suggestedMin: 0,
          suggestedMax: 6,
        },
        angleLines: {
          color: '#80DFC0',
          lineWidth: 2
        },
        pointLabels: {
          fontColor: '#171717',
          fontFamily: "'bill_corp_narbold', sans-serif",
          fontSize: 16,
        },
        gridLines: {
          color: '#D5F5EA'
        }
      }
    };

    var ctx = document.getElementById("comparison-chart").getContext('2d');

    chart.chart = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options
    });
  },

  updateChartValues: function(data) {
    chart.chart.data.datasets[0].data = data;
    chart.chart.update();
  }

};
