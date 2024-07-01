fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response=>response.json())
.then(data=>{

    let sorted = data.reverse();
    let lastUpdated = sorted[0].data.split('T')[0].split('-').reverse().join('/');
    document.querySelector('#lastDate').innerHTML = lastUpdated;

    console.log(sorted);
})