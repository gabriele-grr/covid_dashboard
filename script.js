fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response=>response.json())
.then(data=>{

    let sorted = data.reverse();
    let lastUpdated = sorted[0].data.split('T')[0].split('-').reverse().join('/');
    document.querySelector('#last-date').innerHTML = lastUpdated;

    let lastDayData = sorted.filter(el=> el.data == sorted[0].data);

    let totalCases = lastDayData.map(el => el.totale_casi).reduce((t,n) => t+n);
    document.querySelector('#total-cases').innerHTML = totalCases;

    let totalDead = lastDayData.map(el=> el.deceduti).reduce((t,n)=> t+n);
    document.querySelector('#total-dead').innerHTML = totalDead;

    let totalHealed = lastDayData.map(el => el.dimessi_guariti).reduce((t,n) => t+n);
    document.querySelector('#total-healed').innerHTML = totalHealed;

    let totalPositives = lastDayData.map(el => el.totale_positivi).reduce((t,n) => t+n);
    document.querySelector('#total-positives').innerHTML = totalPositives;

    (async function() {

    new Chart(
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

    })();

    let regions = document.querySelectorAll('[data-italian');

    regions.forEach(region => {
      region.addEventListener('click', function(){

          let regionSelectedName = region.attributes[2].value;

          let regionSelectedFilter = lastDayData.filter(el => el.denominazione_regione == regionSelectedName)[0];

          let regionData = document.getElementById('region-data');

          let regionNewPositives = sorted.reverse()
                                  .filter(el => el.denominazione_regione == regionSelectedName)
                                  .map(el => [el.data, el.nuovi_positivi]);
          
          let regionNewPositivesDate = regionNewPositives.map(el => el[0]).map(el => el.split("T")[0].split("-").reverse().join("/"));

          let maxRegionNewPositives = Math.max(...regionNewPositives.map(el => el[1]));

          let regionChartCanvas = document.getElementById('region-data-chart');
          let regionChartParent = document.getElementById('region-data-chart-container');

          // Destroy previous chart instance if it exists
          if (regionChartCanvas) {
            regionChartCanvas.remove(); // Remove the canvas element
            let newCanvas = document.createElement('canvas');
            newCanvas.id = 'region-data-chart';
            regionChartParent.appendChild(newCanvas);
          }
          
          
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
        

          new Chart(
            document.getElementById('region-data-chart'),
            {
              type: 'line',
              options: {
                animation: false,
                plugins: {
                  legend: {
                    display: false
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
                        'rgb(6, 59, 80)'
                      ],
                  }
                  
                ]
              }
            }
          );

      })

  })

    
})