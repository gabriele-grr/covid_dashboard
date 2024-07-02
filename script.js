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



    console.log(lastDayData);
})