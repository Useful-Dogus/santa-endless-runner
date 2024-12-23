function onSubmit(e) {
  e.preventDefault();
  startGame();
}

function startGame() {
  const playerName = document.getElementById('playerName').value.trim();
  if (!playerName) {
    alert('이름을 입력해주세요!');
    return;
  }
  console.log('start game', playerName);
  window.location.href = `game?username=${encodeURIComponent(playerName)}`;
}

function initForm() {
  const playerName = document.getElementById('playerName');
  playerName.value = '';
}

document.addEventListener('DOMContentLoaded', initForm);
