const GAME_OBJECT_CONFIG = {
  SANTA_WIDTH: window.innerWidth * 0.1,
  SANTA_HEIGHT: window.innerWidth * 0.1 * 0.6,
  GIFT_SIZE: window.innerWidth * 0.05 * 0.8 * 0.8,
  OBSTACLE_SIZE: window.innerWidth * 0.05 * 0.8 * 0.4,
  JUMP_FORCE: -7,
  GRAVITY: 0.35,
};

class Santa {
  constructor() {
    this.width = GAME_OBJECT_CONFIG.SANTA_WIDTH;
    this.height = GAME_OBJECT_CONFIG.SANTA_HEIGHT;
    this.x = 100;
    this.y = canvas.height / 2;
    this.velocity = 0;
    this.isMovingUp = false;
    this.moveCounter = 0; // 애니메이션을 위한 카운터
    this.santaImage = new Image();
    this.santaImage.src = 'assets/rudolph-and-santa.png';
  }

  update() {
    if (this.isMovingUp) {
      this.velocity = GAME_OBJECT_CONFIG.JUMP_FORCE;
    } else {
      this.velocity += GAME_OBJECT_CONFIG.GRAVITY;
    }

    this.y += this.velocity;

    // Boundary checks
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
    if (this.y > canvas.height - this.height) {
      this.y = canvas.height - this.height;
      this.velocity = 0;
    }

    // 움직임 애니메이션을 위한 카운터 업데이트
    this.moveCounter += 0.1;
  }

  draw() {
    ctx.save();
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    // 움직임에 따른 기울기 효과
    const tilt = Math.sin(this.moveCounter) * 5;
    ctx.translate(centerX, centerY);
    ctx.rotate((tilt * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // 산타클로스 이미지 그리기
    ctx.drawImage(this.santaImage, this.x, this.y, this.width, this.height);

    ctx.restore();
  }
}

class Gift {
  constructor() {
    this.size = GAME_OBJECT_CONFIG.GIFT_SIZE;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.size);
    this.speed = 6;
    this.collision = false;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    if (this.collision) {
      // show score after collision
      ctx.fillStyle = '#00aa00';
      ctx.font = '20px Arial';
      ctx.fillText(`+10`, this.x, this.y);
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // 선물 상자 그리기
    ctx.fillStyle = '#33aa33'; // 초록색 선물상자
    ctx.fillRect(0, 0, this.size, this.size);

    // 가운데 십자 리본
    ctx.fillStyle = '#ff3333'; // 빨간색 리본
    ctx.fillRect(this.size / 2 - 3, 0, 6, this.size); // 세로 리본
    ctx.fillRect(0, this.size / 2 - 3, this.size, 6); // 가로 리본

    // 리본 매듭과 장식 (상자 위에 표시)
    const ribbonY = -10; // 상자 위로 올라간 위치

    // 리본 고리 (왼쪽)
    ctx.beginPath();
    ctx.moveTo(this.size / 2 - 15, ribbonY + 15);
    ctx.quadraticCurveTo(this.size / 2 - 5, ribbonY + 5, this.size / 2, ribbonY + 15);

    // 리본 고리 (오른쪽)
    ctx.moveTo(this.size / 2 + 15, ribbonY + 15);
    ctx.quadraticCurveTo(this.size / 2 + 5, ribbonY + 5, this.size / 2, ribbonY + 15);

    // 늘어진 리본 끝 (왼쪽)
    ctx.moveTo(this.size / 2 - 12, ribbonY + 15);
    ctx.lineTo(this.size / 2 - 8, ribbonY + 25);
    ctx.lineTo(this.size / 2 - 4, ribbonY + 15);

    // 늘어진 리본 끝 (오른쪽)
    ctx.moveTo(this.size / 2 + 12, ribbonY + 15);
    ctx.lineTo(this.size / 2 + 8, ribbonY + 25);
    ctx.lineTo(this.size / 2 + 4, ribbonY + 15);

    ctx.fillStyle = '#ff3333';
    ctx.fill();

    // 리본 매듭 중앙
    ctx.beginPath();
    ctx.arc(this.size / 2, ribbonY + 15, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3333'; // 살짝 진한 빨강
    ctx.fill();

    ctx.restore();
  }
}

class Icicle {
  constructor() {
    this.size = GAME_OBJECT_CONFIG.OBSTACLE_SIZE;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.size);
    this.spikes = Math.floor(Math.random() * 6) + 4;
    this.speed = 6;
    this.spikeLengths = Array(this.spikes)
      .fill(0)
      .map(() => Math.random() * 10 + 10);
    this.collision = false;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    if (this.collision) {
      // show score after collision
      ctx.fillStyle = '#aa0000';
      ctx.font = '20px Arial';
      ctx.fillText(`-10`, this.x, this.y);
      return;
    }

    ctx.save();
    ctx.translate(this.x + this.size / 2, this.y + this.size / 2);

    // 얼음의 기본 형태 (약간 투명한 하늘색)
    ctx.fillStyle = 'rgba(150, 217, 234, 0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // 울퉁불퉁한 가시들 추가 (더 진한 하늘색)
    ctx.fillStyle = 'rgba(126, 192, 238, 0.8)';
    for (let i = 0; i < this.spikes; i++) {
      const angle = (i / this.spikes) * Math.PI * 2;
      const spikeLength = this.spikeLengths[i];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      // 가시의 기본 위치
      const x1 = Math.cos(angle) * (this.size / 2);
      const y1 = Math.sin(angle) * (this.size / 2);
      // 가시의 끝점
      const x2 = Math.cos(angle) * (this.size / 2 + spikeLength);
      const y2 = Math.sin(angle) * (this.size / 2 + spikeLength);
      // 가시의 양쪽 끝점
      const angle1 = angle - 0.2;
      const angle2 = angle + 0.2;
      const x3 = Math.cos(angle1) * (this.size / 2);
      const y3 = Math.sin(angle1) * (this.size / 2);
      const x4 = Math.cos(angle2) * (this.size / 2);
      const y4 = Math.sin(angle2) * (this.size / 2);

      // 삼각형 모양의 뾰족한 가시 그리기
      ctx.moveTo(x3, y3);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fill();
    }

    // 얼음의 반짝임 효과
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(-this.size / 6, -this.size / 6, this.size / 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Fire {
  constructor(x, y, size) {
    this.size = GAME_OBJECT_CONFIG.OBSTACLE_SIZE * 2;
    this.direction = Math.random() < 0.5 ? 'up' : 'down';
    this.x = canvas.width;
    this.y = this.direction === 'up' ? canvas.height - this.size : this.size;
    this.speed = 6;
    this.collision = false;
  }

  update() {
    this.x -= this.speed;
  }

  draw() {
    if (this.collision) {
      // show score after collision
      ctx.fillStyle = '#aa0000';
      ctx.font = '20px Arial';
      ctx.fillText(-10, this.x, this.y);
      return;
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.direction === 'down') {
      ctx.rotate(Math.PI);
    }

    const centerX = this.size / 2;
    const height = this.size;

    // 빨간 외부 불꽃
    ctx.beginPath();
    ctx.fillStyle = '#ff3333';
    ctx.moveTo(centerX - this.size / 2, height);
    ctx.quadraticCurveTo(centerX - this.size / 3, height / 2, centerX, 0);
    ctx.quadraticCurveTo(centerX + this.size / 3, height / 2, centerX + this.size / 2, height);
    ctx.closePath();
    ctx.fill();

    // 주황색 중간 불꽃
    ctx.beginPath();
    ctx.fillStyle = '#ff9933';
    const midSize = this.size * 0.5;
    ctx.moveTo(centerX - midSize / 2, height);
    ctx.quadraticCurveTo(centerX - midSize / 3, height / 2.2, centerX, height / 6);
    ctx.quadraticCurveTo(centerX + midSize / 3, height / 2.2, centerX + midSize / 2, height);
    ctx.closePath();
    ctx.fill();

    // 노란색 내부 불꽃
    ctx.beginPath();
    ctx.fillStyle = '#ffff66';
    const innerSize = this.size * 0.2;
    ctx.moveTo(centerX - innerSize / 2, height);
    ctx.quadraticCurveTo(centerX - innerSize / 3, height / 2.5, centerX, height / 4);
    ctx.quadraticCurveTo(centerX + innerSize / 3, height / 2.5, centerX + innerSize / 2, height);
    ctx.closePath();
    ctx.fill();

    // 하이라이트 추가
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    const highlightSize = this.size * 0.2;
    ctx.moveTo(centerX - highlightSize / 2, height / 1.5);
    ctx.quadraticCurveTo(centerX, height / 2, centerX + highlightSize / 2, height / 1.5);
    ctx.quadraticCurveTo(centerX, height / 1.8, centerX - highlightSize / 2, height / 1.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
