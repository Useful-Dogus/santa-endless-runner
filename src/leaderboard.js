function loadLeaderboard() {
  const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const tbody = document.getElementById('leaderboard-body');
  tbody.innerHTML = '';

  leaderboardData
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${entry.name}</td>
                        <td>${entry.score}</td>
                    `;
      tbody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', loadLeaderboard);
