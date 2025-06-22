const spinner = document.querySelector('.spinner');
const spinnerPath = document.querySelector('.spinner-path');
const speedSlider = document.getElementById('speed-slider');
const monochromeSwitch = document.getElementById('monochrome-switch');
const body = document.body;
const closeButton = document.getElementById('close-settings');

const params = new URLSearchParams(window.location.search);
const monochromeRaw = params.get('monochrome');
const speedRaw = params.get('speed');

const updateSpeed = (multiplier) => {
  spinner.style.animationDuration = `${1568.63 / multiplier}ms`;
  spinnerPath.style.animationDuration = `${1333 / multiplier}ms, ${5332 / multiplier}ms, ${5332 / multiplier}ms`;
}
const getSpeedFromURL = () => {
  if (!speedRaw) return 1;
  const speed = parseFloat(speedRaw);
  return (!isNaN(speed) && speed >= 0.1 && speed <= 5) ? speed : 1;
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
closeButton.addEventListener('click', () => {
  const speed = parseFloat(speedSlider.value).toFixed(1);
  const isMono = monochromeSwitch.checked;

  const newParams = new URLSearchParams();
  newParams.set('speed', speed);
  newParams.set('monochrome', isMono);

  const newURL = `${location.pathname}?${newParams.toString()}`;
  history.replaceState(null, '', newURL);
});
