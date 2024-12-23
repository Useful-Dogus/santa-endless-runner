function onSubmit(e) {
  e.preventDefault();
  startGame();
}

function startGame() {
  const playerName = document.getElementById('player-name').value.trim();
  if (!playerName) {
    alert('이름을 입력해주세요!');
    return;
  }
  window.location.href = `game?username=${encodeURIComponent(playerName)}`;
}
