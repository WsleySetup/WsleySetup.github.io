

window.onload = function() {
  promptUsername();

  // After starting the game, send current score immediately:
  sendCurrentScore();
};

function sendCurrentScore() {
  if (!username) return; // no username, don't send

  const score = parseInt(document.getElementById("powerupCount").innerText) || 0;

  fetch("https://melondog-server.onrender.com/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, score })
  }).then(res => {
    if (!res.ok) throw new Error("Failed to save score");
  }).catch(err => {
    console.error("Score submission failed:", err);
  });
}

function promptUsername() {
  let savedName = localStorage.getItem("username");
  if (savedName) {
    username = savedName;
    updateUsernameDisplay();
    startGame();
  } else {
    username = prompt("Enter your username to start:");
    if (!username || username.trim() === "") {
      alert("You need a username to play.");
      promptUsername();
    } else {
      localStorage.setItem("username", username);
      updateUsernameDisplay();
      startGame();
    }
  }
}

function updateUsernameDisplay() {
  const usernameText = document.getElementById("usernameText");
  usernameText.textContent = username || "Guest";
}

document.getElementById("usernameText").addEventListener("click", () => {
  username = prompt("Enter your username to start:");
  if (username && username.trim() !== "") {
    localStorage.setItem("username", username);
    updateUsernameDisplay();
  }
});

function submitScore(score) {
  fetch("https://melondog-server.onrender.com/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, score })
  }).then(res => {
    if (!res.ok) throw new Error("Failed to save score");
  }).catch(err => {
    console.error("Score submission failed:", err);
  });
}

function sendScore() {
  const powerupScoreEl = document.getElementById("powerupCount");
  const score = parseInt(powerupScoreEl.innerText) || 0;

  if (!username) return; // No username, no score sent

  fetch("https://melondog-server.onrender.com/score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, score })
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to save score");
    console.log(`Score sent: ${score} for ${username}`);
  })
  .catch(err => {
    console.error("Score submission failed:", err);
  });
}

// Send score every 30 seconds while playing
setInterval(sendScore, 1000);

function updateLeaderboard() {
  fetch('https://melondog-server.onrender.com/leaderboard')
    .then(res => res.json())
    .then(data => {
      const leaderboard = document.getElementById('leaderboard');
      leaderboard.innerHTML = '';

      if (data.length === 0) {
        leaderboard.textContent = 'No scores yet. Be the first!';
        return;
      }

      const list = document.createElement('ul');
      list.style.listStyle = 'none';
      list.style.padding = '0';
      list.style.margin = '0';

      // Keep track of usernames to avoid duplicates on front-end (shouldn't happen if backend is correct)
      const seenUsernames = new Set();

      data.forEach((entry, index) => {
        // Skip duplicates if any
        if (seenUsernames.has(entry.username.toLowerCase())) return;
        seenUsernames.add(entry.username.toLowerCase());

        const item = document.createElement('li');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.padding = '4px 8px';
        item.style.borderBottom = '1px solid #444';

        const rankSpan = document.createElement('span');
        rankSpan.textContent = `${index + 1}. `;
        rankSpan.style.fontWeight = 'bold';
        rankSpan.style.marginRight = '8px';

        const userSpan = document.createElement('span');
        userSpan.textContent = entry.username;
        userSpan.style.flexGrow = '1';

        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = entry.score;
        scoreSpan.style.fontWeight = 'bold';

        item.appendChild(rankSpan);
        item.appendChild(userSpan);
        item.appendChild(scoreSpan);
        list.appendChild(item);
      });

      leaderboard.appendChild(list);
    })
    .catch(err => {
      console.error('Failed to update leaderboard:', err);
      const leaderboard = document.getElementById('leaderboard');
      leaderboard.textContent = 'Failed to load leaderboard.';
    });
}



// Call it once on page load
updateLeaderboard();

// Then every 10 seconds
setInterval(updateLeaderboard, 1000); // every 10,000ms (10 seconds)
// Also send score when user leaves or refreshes page (uses navigator.sendBeacon for reliability)
window.addEventListener('pagehide', () => {
  if (!username) return;

  const powerupScoreEl = document.getElementById("powerupCount");
  const score = parseInt(powerupScoreEl.innerText) || 0;

  const data = JSON.stringify({ username, score });
  navigator.sendBeacon('https://melondog-server.onrender.com/score', new Blob([data], { type: 'application/json' }));
});

// Example: Call this when the user closes the tab or game ends
window.addEventListener('beforeunload', () => {
  if (!username) return;

  const score = parseInt(document.getElementById("powerupCount").innerText) || 0;
  const data = JSON.stringify({ username, score });

  navigator.sendBeacon('https://melondog-server.onrender.com/score', new Blob([data], { type: 'application/json' }));
});




// Get leaderboard from server
fetch('https://melondog-server.onrender.com/leaderboard')
  .then(res => res.json())
  .then(data => {
    console.log('Leaderboard:', data);
    const leaderboardEl = document.getElementById("leaderboard");
leaderboardEl.innerHTML = '<h3>Top Scores</h3>' + data.map(
  entry => `<div>${entry.username}: ${entry.score}</div>`
).join('');
  });

    function showPopup() {
    document.getElementById("popup").style.display = "block";
    document.getElementById("popup-overlay").style.display = "block";
  }

  function hidePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("popup-overlay").style.display = "none";
  }

     function startMusic() {
    const music = document.getElementById("bg-music");
    music.play().then(() => {
      console.log("Music started!");
    }).catch((e) => {
      console.warn("Autoplay failed:", e);
    });
  }

    const bgMusic = document.getElementById("bg-music");
  const button = document.querySelector("button");

  function toggleMute() {
    bgMusic.muted = !bgMusic.muted;
    button.textContent = bgMusic.muted ? "🔇" : "🔊";
  }
  let sfxMuted = false;
const sfxButton = document.getElementById("mutesfx");


function toggleSFXMute() {
  sfxMuted = !sfxMuted;
  bounceSound.muted = sfxMuted;
  cornerSound.muted = sfxMuted;
  powerupSound.muted = sfxMuted;
  sfxButton.textContent = sfxMuted ? "🔇" : "🔊";
}

    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.ieRequestAnimationFrame ||
          function(callback) {
              window.setTimeout(callback, 1000 / 60);
          };
    })();
    

    const dogCountEl = document.getElementById('dogCount');

    function updateDogCount() {
      dogCountEl.innerText = images.length;
    }

    let fpsElement = document.getElementById("fps");

    let then = Date.now() / 1000;  // get time in seconds

    let render = function() {
      let now = Date.now() / 1000;  // get time in seconds
      let elapsedTime = now - then;
      then = now;
      let fps = 1 / elapsedTime;
      fpsElement.innerText = fps.toFixed(2);
      requestAnimFrame(render);
    };
    render();

    document.addEventListener('contextmenu', e => e.preventDefault());
    document.onkeydown = function(e) {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)
      ) {
        return false;
      }
    };

    const timerEl = document.getElementById('timer');
    const imgWidth = 100;
    const imgHeight = 100;

    const bounceSound = new Audio('sounds/boing.mp3');
    const cornerSound = new Audio('sounds/corner.mp3');
    const powerupSound = new Audio('sounds/powerup.mp3');
    bounceSound.volume = 1;
    cornerSound.volume = 1;
    powerupSound.volume = 0.1;

    const powerUps = [];
    const images = [];

    function createBouncingImage(x = 0, y = 0, speedX = 6, speedY = 4) {
      const img = document.createElement('img');
      img.src = 'images/wes.png';
      img.classList.add('bounceImage');
      document.body.appendChild(img);

      // Removed updateDogCount() from here since images array not updated yet

      return { el: img, x, y, speedX, speedY, width: imgWidth, height: imgHeight };
    }

    function loadGame() {
      const savedState = localStorage.getItem('melondogSave');
      if (!savedState) {
        alert("No saved game found!");
        return;
      }
      const gameState = JSON.parse(savedState);

      // Clear existing dogs and powerups
      images.forEach(dog => dog.el.remove());
      images.length = 0;
      powerUps.forEach(p => p.el.remove());
      powerUps.length = 0;

      // Load dogs
      gameState.dogs.forEach(dogData => {
        const dog = createBouncingImage(dogData.x, dogData.y, dogData.speedX, dogData.speedY);
        dog.width = dogData.width;
        dog.height = dogData.height;
        dog.el.style.width = dog.width + 'px';
        dog.el.style.height = dog.height + 'px';
        dog.el.style.filter = dogData.filter;
        images.push(dog);
      });
      updateDogCount();

      // Load powerups
      gameState.powerups.forEach(pData => {
        const powerupEl = document.createElement('div');
        powerupEl.classList.add('powerup', pData.name);
        powerupEl.style.left = pData.x + 'px';
        powerupEl.style.top = pData.y + 'px';
        document.body.appendChild(powerupEl);
        powerUps.push({ el: powerupEl, name: pData.name });
      });

      // Load timer
      startTime = Date.now() - gameState.elapsedTime;
      updateTimer();

      // Load score
      document.getElementById("powerupCount").innerText = gameState.powerupCount;

      // Load mute states
      sfxMuted = gameState.sfxMuted;
      bounceSound.muted = sfxMuted;
      cornerSound.muted = sfxMuted;
      powerupSound.muted = sfxMuted;
      sfxButton.textContent = sfxMuted ? "🔇" : "🔊";

      bgMusic.muted = gameState.bgMusicMuted;
      button.textContent = bgMusic.muted ? "🔇" : "🔊";
      if (!bgMusic.muted) {
        bgMusic.play().catch(e => console.warn("Autoplay failed on load:", e));
      }

      alert("Game Loaded!");
    }

    function saveGame() {
      const gameState = {
        elapsedTime: Date.now() - startTime,
        powerupCount: parseInt(document.getElementById("powerupCount").innerText),
        sfxMuted: sfxMuted,
        bgMusicMuted: bgMusic.muted,
        dogs: images.map(dog => ({
          x: dog.x,
          y: dog.y,
          speedX: dog.speedX,
          speedY: dog.speedY,
          width: dog.width,
          height: dog.height,
          filter: dog.el.style.filter
        })),
        powerups: powerUps.map(p => ({
          name: p.name,
          x: parseFloat(p.el.style.left),
          y: parseFloat(p.el.style.top)
        }))
      };
      localStorage.setItem('melondogSave', JSON.stringify(gameState));
      alert("Game Saved!");
    }

    function applyPowerUp(type, image) {
      const powerupScoreEl = document.getElementById("powerupCount");
let currentScore = parseInt(powerupScoreEl.innerText);
powerupScoreEl.innerText = currentScore + 1;
      if (type === 'speedup') {
        image.speedX *= 1.5;
        image.speedY *= 1.5;
      } else if (type === 'sizechange') {
        const scale = Math.random() > 0.5 ? 1.5 : 0.7;
        image.width = imgWidth * scale;
        image.height = imgHeight * scale;
        image.el.style.width = image.width + 'px';
        image.el.style.height = image.height + 'px';
      } else if (type === 'colorchange') {
        const hue = Math.floor(Math.random() * 360);
        image.el.style.filter = `hue-rotate(${hue}deg)`;
      } else if (type === 'duplicate') {
        const clone = createBouncingImage(image.x, image.y, -image.speedX, -image.speedY);
        images.push(clone);
        updateDogCount();  // Update count after adding duplicate dog
      }
    }

    function spawnPowerUp() {
      if (powerUps.length >= 999) return;

      const types = ['speedup', 'sizechange', 'colorchange', 'duplicate'];
      const chosenType = types[Math.floor(Math.random() * types.length)];

      const powerupEl = document.createElement('div');
      powerupEl.classList.add('powerup', chosenType);

      const padding = 50;
      const x = Math.random() * (window.innerWidth - padding * 2) + padding;
      const y = Math.random() * (window.innerHeight - padding * 2) + padding;

      powerupEl.style.left = x + 'px';
      powerupEl.style.top = y + 'px';

      document.body.appendChild(powerupEl);
      powerUps.push({ el: powerupEl, name: chosenType });
    }

    function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    let startTime = Date.now();
    function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  timerEl.textContent =
    (hours < 10 ? '0' : '') + hours + ':' +
    (minutes < 10 ? '0' : '') + minutes + ':' +
    (seconds < 10 ? '0' : '') + seconds;
}

    function update() {
      for (let img of images) {
        img.x += img.speedX;
        img.y += img.speedY;

        let hitX = false;
        let hitY = false;

        if (img.x + img.width > window.innerWidth) {
          img.x = window.innerWidth - img.width;
          img.speedX = -img.speedX;
          hitX = true;
        }
        if (img.x < 0) {
          img.x = 0;
          img.speedX = -img.speedX;
          hitX = true;
        }
        if (img.y + img.height > window.innerHeight) {
          img.y = window.innerHeight - img.height;
          img.speedY = -img.speedY;
          hitY = true;
        }
        if (img.y < 0) {
          img.y = 0;
          img.speedY = -img.speedY;
          hitY = true;
        }

        if (hitX && hitY) {
          cornerSound.currentTime = 0;
          cornerSound.play();
        } else if (hitX || hitY) {
          bounceSound.currentTime = 0;
          bounceSound.play();
        }

        img.el.style.left = img.x + 'px';
        img.el.style.top = img.y + 'px';

        // Power-up collision
        for (let i = powerUps.length - 1; i >= 0; i--) {
          const p = powerUps[i];
          const rectP = p.el.getBoundingClientRect();
          const rectI = img.el.getBoundingClientRect();

          if (isColliding(
            rectI.left, rectI.top, rectI.width, rectI.height,
            rectP.left, rectP.top, rectP.width, rectP.height
          )) {
            applyPowerUp(p.name, img);
            powerupSound.currentTime = 0;
            powerupSound.play();
            document.body.removeChild(p.el);
            powerUps.splice(i, 1);
          }
        }
      }

      updateTimer();
      requestAnimationFrame(update);
    }

    // Initial dog setup:
    images.push(createBouncingImage());
    updateDogCount();

    setInterval(spawnPowerUp, 5000);
    update();