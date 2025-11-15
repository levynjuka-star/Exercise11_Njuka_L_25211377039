const ctx = document.getElementById('revenueChart').getContext('2d');

const sampleData = {
  north: [120, 130, 140, 150],
  south: [90, 95, 100, 110],
  east: [75, 80, 85, 90],
  west: [60, 70, 75, 80]
};

const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
const colors = {
  north: '#4e79a7',
  south: '#f28e2b',
  east: '#e15759',
  west: '#76b7b2'
};

let currentChart;

function createChart(type, region) {
  if (currentChart) {
    currentChart.destroy();
  }

  let datasets = [];
  if (region === 'all') {
    datasets = Object.keys(sampleData).map(key => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      data: sampleData[key],
      backgroundColor: colors[key],
      borderColor: colors[key],
      fill: type !== 'line'
    }));
  } else {
    datasets = [{
      label: region.charAt(0).toUpperCase() + region.slice(1),
      data: sampleData[region],
      backgroundColor: Object.values(colors),
      borderColor: colors[region],
      fill: type !== 'line'
    }];
  }

  const dataConfig = {
    labels: labels,
    datasets: type === 'pie' || type === 'doughnut' ? [{
      label: region,
      data: region === 'all'
        ? Object.values(sampleData).reduce((acc, val) => acc.map((v, i) => v + val[i]), [0, 0, 0, 0])
        : sampleData[region],
      backgroundColor: Object.values(colors)
    }] : datasets
  };

  currentChart = new Chart(ctx, {
    type: type,
    data: dataConfig,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Regional Revenue Distribution',
          font: { size: 18 }
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: type === 'pie' || type === 'doughnut' ? {} : {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Revenue (in $K)' }
        },
        x: {
          title: { display: true, text: 'Quarter' }
        }
      }
    }
  });
}

document.getElementById('regionSelect').addEventListener('change', function () {
  createChart(document.getElementById('chartTypeSelect').value, this.value);
});

document.getElementById('chartTypeSelect').addEventListener('change', function () {
  createChart(this.value, document.getElementById('regionSelect').value);
});

// Initialize chart
createChart('bar', 'all');