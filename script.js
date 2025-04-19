let weights = [];
let editIndex = null;

const ctx = document.getElementById('weightChart').getContext('2d');
let weightChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Weight (kg)',
      data: [],
      borderColor: 'blue',
      tension: 0.1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  }
});

function switchTab(tab) {
  document.getElementById('trackerTab').style.display = tab === 'tracker' ? 'block' : 'none';
  document.getElementById('graphTab').style.display = tab === 'graph' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-btn')[tab === 'tracker' ? 0 : 1].classList.add('active');
  if (tab === 'graph') updateChart();
}

function addWeight() {
  const input = document.getElementById('weightInput');
  const weight = parseFloat(input.value);
  if (!weight) return;

  const now = new Date();
  const entry = {
    weight,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString()
  };

  if (editIndex !== null) {
    weights[editIndex] = entry;
    editIndex = null;
    document.getElementById('addBtn').innerText = 'Add Weight';
  } else {
    weights.push(entry);
  }

  input.value = '';
  renderEntries();
}

function deleteWeight(index) {
  weights.splice(index, 1);
  renderEntries();
}

function editWeight(index) {
  const entry = weights[index];
  document.getElementById('weightInput').value = entry.weight;
  editIndex = index;
  document.getElementById('addBtn').innerText = 'Update Weight';
}

function renderEntries() {
  const entriesDiv = document.getElementById('entries');
  entriesDiv.innerHTML = '';
  weights.forEach((entry, index) => {
    entriesDiv.innerHTML += `
      <div class="card">
        <div class="flex-space-between">
          <div>
            <strong>Weight:</strong> ${entry.weight} kg<br>
            <small>${entry.date} at ${entry.time}</small>
          </div>
          <div>
            <button onclick="editWeight(${index})">Edit</button>
            <button onclick="deleteWeight(${index})">Delete</button>
          </div>
        </div>
      </div>`;
  });
}

function updateChart() {
  weightChart.data.labels = weights.map(e => `${e.date} ${e.time}`);
  weightChart.data.datasets[0].data = weights.map(e => e.weight);
  weightChart.update();
}
