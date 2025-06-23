const spinner = document.querySelector('.spinner');
const spinnerPath = document.querySelector('.spinner-path');
const speedSlider = document.getElementById('speed-slider');
const monochromeSwitch = document.getElementById('monochrome-switch');
const body = document.body;
const settingsDialog = document.getElementById('settings-dialog');
const resetButton = document.getElementById('reset-button');
const hideSettingsButtonSwitch = document.getElementById('hide-settings-button-switch');
const settingsButton = document.getElementById('settings-button');
const ambientModeSwitch = document.getElementById('ambient-mode-switch');
const svg = document.querySelector('svg');

const params = new URLSearchParams(window.location.search);
const monochromeRaw = params.get('monochrome');
const speedRaw = params.get('speed');
const ambientModeRaw = params.get('ambient');

const updateSpeed = (multiplier) => {
  spinner.style.animationDuration = `${1568.63 / multiplier}ms`;
  spinnerPath.style.animationDuration = `${1333 / multiplier}ms, ${5332 / multiplier}ms, ${5332 / multiplier}ms`;
}
const getSpeedFromURL = () => {
  if (!speedRaw) return 1;
  const speed = parseFloat(speedRaw);
  return (!isNaN(speed) && speed >= 0.1 && speed <= 5) ? speed : 1;
}
const observeSettingsDialog = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === 'open') {
      const isOpen = settingsDialog.hasAttribute('open');
      if (!isOpen) {
        const speed = parseFloat(speedSlider.value).toFixed(1);
        const isMono = monochromeSwitch.checked;
        const isAmbient = ambientModeSwitch.checked;

        const newParams = new URLSearchParams();
        newParams.set('speed', speed);
        newParams.set('monochrome', isMono);
        newParams.set('ambient', isAmbient);

        const newURL = `${location.pathname}?${newParams.toString()}`;
        history.replaceState(null, '', newURL);
      }
    }
  }
});
const isDarkTheme = () => {
  return body.classList.contains('dark');
}
const updateAmbientModeSwitchState = () => {
  ambientModeSwitch.disabled = !isDarkTheme();
}

let initialSpeed = getSpeedFromURL();
if (!isNaN(initialSpeed)) {
  speedSlider.value = initialSpeed;
  updateSpeed(initialSpeed);
}
if (monochromeRaw === 'true') {
  monochromeSwitch.checked = true;
  body.classList.add('monochrome');
}
if (ambientModeRaw === 'true' && isDarkTheme()) {
  ambientModeSwitch.checked = true;
  svg.setAttribute('filter', 'url(#glow)');
}
updateAmbientModeSwitchState();

speedSlider.addEventListener('input', () => {
  const speed = parseFloat(speedSlider.value);
  updateSpeed(speed);
});
monochromeSwitch.addEventListener('change', () => {
  if (monochromeSwitch.checked) {
    body.classList.add('monochrome');
  } else {
    body.classList.remove('monochrome');
  }
});
resetButton.addEventListener('click', () => {
  speedSlider.value = 1;
  ui('#speed-slider');
  monochromeSwitch.checked = false;
  updateSpeed(1);
  body.classList.remove('monochrome');
  hideSettingsButtonSwitch.checked = false;
  settingsButton.classList.remove('hidden');
  ambientModeSwitch.checked = false;
  svg.removeAttribute('filter');
  history.replaceState(null, '', location.pathname);
});
hideSettingsButtonSwitch.addEventListener('change', () => {
  const isHidden = hideSettingsButtonSwitch.checked;
  if (isHidden) {
    settingsButton.classList.add('hidden');
  } else {
    settingsButton.classList.remove('hidden');
  }
});
document.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", (event) => {
    const switchInput = li.querySelector('input[type="checkbox"]');
    if (!switchInput) return;
    if (switchInput.disabled) return;
    if (event.target.tagName === 'INPUT' || event.target.closest('label.slider')) {
      return;
    }
    switchInput.checked = !switchInput.checked;
    switchInput.dispatchEvent(new Event("change", { bubbles: true }));
  });
});
ambientModeSwitch.addEventListener('change', () => {
  if (ambientModeSwitch.checked) {
    svg.setAttribute('filter', 'url(#glow)');
  } else {
    svg.removeAttribute('filter');
  }
});

observeSettingsDialog.observe(settingsDialog, { attributes: true });
