// Initialize variables for charts
let regionChart = null;
let pieChart = null;


// Function to create or update pie chart
function createOrUpdatePieChart(totalDead, totalHealed, totalPositives) {
  if (pieChart) {
    pieChart.data.datasets[0].data = [totalDead, totalHealed, totalPositives];
    pieChart.update();
  } else {
    pieChart = new Chart(
      document.getElementById('pie-chart'),
      {
        type: 'doughnut',
        options: {
          animation: false,
          plugins: {
            legend: {
              display: false
            }
          }
        },
        data: {
          labels: ["Total dead", "Total healed", "Total positives"],
          datasets: [
            {
              label: ' ',
              data: [totalDead, totalHealed, totalPositives],
              backgroundColor: [
                'rgb(6, 59, 80)',
                'rgb(9, 93, 126)',
                'rgb(159, 178, 185)'
              ],
            }
          ]
        }
      }
    );
  }
}

// Function to create or update region chart
function createOrUpdateRegionChart(regionNewPositivesDate, regionNewPositives) {
  const regionChartCanvas = document.getElementById('region-data-chart');

  // Clear existing chart if it exists
  if (regionChart) {
    regionChart.destroy();
  }

  // Create new chart
  regionChart = new Chart(
    regionChartCanvas,
    {
      type: 'line',
      options: {
        animation: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(21, 21, 21)',
              borderColor: 'rgba(21, 21, 21)',
            },
            ticks: {
              color: 'rgba(21, 21, 21)'
            }
          },
          y: {
            grid: {
              color: 'rgba(21, 21, 21)',
              borderColor: 'rgba(21, 21, 21)',
            },
            ticks: {
              color: 'rgba(21, 21, 21)'
            }
          }
        }
      },
      data: {
        labels: [...regionNewPositivesDate],
        datasets: [
          {
            label: ' ',
            data: [...regionNewPositives.map(el => el[1])],
            backgroundColor: [
              'rgb(9, 93, 126)'
            ],
            borderColor: 'rgb(6, 59, 80)'
          }

        ]
      }
    }
  );
}

// Fetch data and initialize charts
fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
  .then(response => response.json())
  .then(data => {

    const sorted = data.reverse();
    const lastUpdated = sorted[0].data.split('T')[0].split('-').reverse().join('/');
    document.querySelector('#last-date').innerHTML = lastUpdated;

    const lastDayData = sorted.filter(el => el.data === sorted[0].data);

    const totalCases = lastDayData.map(el => el.totale_casi).reduce((t, n) => t + n);
    document.querySelector('#total-cases').innerHTML = totalCases;

    const totalDead = lastDayData.map(el => el.deceduti).reduce((t, n) => t + n);
    document.querySelector('#total-dead').innerHTML = totalDead;

    const totalHealed = lastDayData.map(el => el.dimessi_guariti).reduce((t, n) => t + n);
    document.querySelector('#total-healed').innerHTML = totalHealed;

    const totalPositives = lastDayData.map(el => el.totale_positivi).reduce((t, n) => t + n);
    document.querySelector('#total-positives').innerHTML = totalPositives;

    // Initialize charts
    createOrUpdatePieChart(totalDead, totalHealed, totalPositives);

    const regions = document.querySelectorAll('[data-italian]');

    regions.forEach(region => {
      region.addEventListener('click', function () {

        const regionSelectedName = region.attributes[2].value;

        const regionSelectedFilter = lastDayData.find(el => el.denominazione_regione === regionSelectedName);

        const regionData = document.getElementById('region-data');

        const regionNewPositives = sorted
          .filter(el => el.denominazione_regione === regionSelectedName)
          .map(el => [el.data, el.nuovi_positivi])
          .reverse();

        const regionNewPositivesDate = regionNewPositives.map(el => el[0].split("T")[0].split("-").reverse().join("/"));

        regionData.innerHTML =
          `
          <h3>${region.attributes[1].value}</h3>
          <p>Total dead: ${regionSelectedFilter.deceduti}</p>
          <p>New infected: ${regionSelectedFilter.nuovi_positivi}</p>
          <p>Total positives: ${regionSelectedFilter.totale_positivi}</p>
          <p>Total healed: ${regionSelectedFilter.dimessi_guariti}</p>
          `;

        regions.forEach(r => r.classList.remove("region-active"));
        region.classList.add("region-active");

        // Create or update region chart
        createOrUpdateRegionChart(regionNewPositivesDate, regionNewPositives);

        // Apply dark theme to chart based on active theme button
        const activeThemeButton = document.querySelector('.theme-btn.theme-active');
        if (activeThemeButton && regionChart) {
          if (activeThemeButton === themeButtons[0]) {
            updateChartColors('rgba(21, 21, 21)', 'rgba(21, 21, 21)');
          } else if (activeThemeButton === themeButtons[1]) {
            updateChartColors('rgba(241, 241, 241)', 'rgba(241, 241, 241)');
          }
        }

      });
    });

    // Trigger click event on Lombardy region to show its details and chart on page load
    const lombardyRegion = document.querySelector('[data-italian="Lombardia"]');
    if (lombardyRegion) {
      const clickEvent = new Event('click');
      lombardyRegion.dispatchEvent(clickEvent);
    }

  });


const themeButtons = document.getElementsByClassName('theme-btn');

for (let i = 0; i < themeButtons.length; i++) {
  themeButtons[i].addEventListener('click', function () {

    // Remove 'theme-active' class from all buttons
    for (let j = 0; j < themeButtons.length; j++) {
      themeButtons[j].classList.remove('theme-active');
    }

    // Add 'theme-active' class to the clicked button
    this.classList.add('theme-active');

    // Apply dark theme to body based on active theme button
    if (this === themeButtons[0]) {
      document.body.style.backgroundColor = 'rgb(241, 241, 241)';
      document.body.style.color = 'rgb(21, 21, 21)';
    } else if (this === themeButtons[1]) {
      document.body.style.backgroundColor = 'rgb(21, 21, 21)';
      document.body.style.color = 'rgb(241, 241, 241)';
    }

    // Apply dark theme to charts based on active theme button
    const activeThemeButton = document.querySelector('.theme-btn.theme-active');
    if (activeThemeButton) {
      if (activeThemeButton === themeButtons[0]) {
        updateChartColors('rgba(21, 21, 21)', 'rgba(21, 21, 21)');
      } else if (activeThemeButton === themeButtons[1]) {
        updateChartColors('rgba(241, 241, 241)', 'rgba(241, 241, 241)');
      }
    }

  });
}

// Function to update chart colors
function updateChartColors(gridColor, tickColor) {
  if (regionChart) {
    regionChart.options.scales.x.grid.borderColor = gridColor;
    regionChart.options.scales.x.grid.color = gridColor;
    regionChart.options.scales.x.ticks.color = tickColor;
    regionChart.options.scales.y.grid.borderColor = gridColor;
    regionChart.options.scales.y.grid.color = gridColor;
    regionChart.options.scales.y.ticks.color = tickColor;
    regionChart.update();
  }
  if (pieChart) {
    pieChart.options.plugins.legend.labels.color = tickColor;
    pieChart.update();
  }
}