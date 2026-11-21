const scenes = {
  errands: ["장보기", "한 손에 장바구니, 관리는 핸즈프리 루바", "패치를 붙이고 장을 보세요. 장바구니를 들고 식료품을 고르는 동안에도 두 손을 자유롭게 쓸 수 있습니다."],
  studio: ["필라테스", "운동하는 시간에 얼굴도 함께", "필라테스 수업에 조금 일찍 도착한 날, 매트를 준비하고 수업을 기다리는 동안 루바로 피부 관리를 시작해 보세요."],
  daily: ["시술 후", "시술 후, 여행 중에도 관리하는 루바", "여행지에서도 평소 피부 관리 루틴을 이어가는 장면입니다. 시술 후 루바 사용을 시작할 시점은 시술받은 의료기관에 확인해 주세요."],
  commute: ["출근길", "붓는 아침, 붙이고 출근하는 루바", "출근 준비를 마치고 루바를 붙여보세요. 대중교통으로 이동하는 동안에도 두 손을 자유롭게 쓸 수 있어요."],
  cafe: ["카페 업무", "노트북 앞에서도 이어가는 루바의 피부관리", "카페에서 노트북을 펼치기 전에 루바를 붙여보세요. 키보드를 두드리고 커피를 마시는 동안에도 피부 관리 루틴을 이어갈 수 있습니다."],
  walk: ["산책", "저녁 산책에 더하는 루바의 관리 시간", "동네를 천천히 걷는 저녁, 루바를 붙이고 평소처럼 산책해 보세요. 피부 관리를 위해 시간을 따로 내기 어려운 날에 활용할 수 있습니다."]
};

const sceneInputs = [...document.querySelectorAll('input[name="scene"]')];
const dialog = document.querySelector('#trial');
const entry = document.querySelector('#trial-entry');
const success = document.querySelector('#trial-success');
const form = document.querySelector('#trial-form');
let trigger;

function selectedScene() {
  return scenes[sceneInputs.find(input => input.checked).value];
}

function showSelectedScene() {
  const [label, title, copy] = selectedScene();
  document.querySelector('#scene-label').textContent = label;
  document.querySelector('#scene-title').textContent = title;
  document.querySelector('#scene-copy').textContent = copy;
}

const campaignScene = new URLSearchParams(location.search).get('scene');
const matchingScene = sceneInputs.find(input => input.value === campaignScene);
if (matchingScene) matchingScene.checked = true;
showSelectedScene();
sceneInputs.forEach(input => input.addEventListener('change', () => {
  showSelectedScene();
  campaignEvent('ruba_scene_select', { scene: input.value });
}));

document.querySelectorAll('[data-trial]').forEach(button => button.addEventListener('click', () => {
  trigger = button;
  form.reset();
  entry.hidden = false;
  success.hidden = true;
  dialog.setAttribute('aria-labelledby', 'trial-title');
  document.querySelector('#picked-scene').textContent = selectedScene()[0];
  dialog.showModal();
}));

form.addEventListener('submit', event => {
  event.preventDefault();
  document.querySelector('#finished-scene').textContent = selectedScene()[0];
  campaignEvent('ruba_experience_complete');
  success.hidden = false;
  entry.hidden = true;
  dialog.setAttribute('aria-labelledby', 'success-title');
  document.querySelector('#success-title').focus();
});

dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));


function campaignEvent(event, properties = {}) {
  window.dataLayer ??= [];
  window.dataLayer.push({ event, campaign: 'ruba_december_2026', ...properties });
}

const memberLink = document.querySelector('[data-conversion="signup_click"]');
const mobileNext = document.querySelector('[data-mobile-next]');
mobileNext.addEventListener('click', () => {
  if (mobileNext.href === memberLink.href) campaignEvent('ruba_signup_click', { placement: 'mobile_bar' });
});

document.querySelectorAll('[data-conversion]').forEach(link => {
  link.addEventListener('click', () => campaignEvent('ruba_' + link.dataset.conversion));
});

const observedSections = new Map([
  [document.querySelector('#scenes'), 'ruba_experience_view'],
  [document.querySelector('#holiday'), 'ruba_offer_view']
]);

const observer = new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).forEach(entry => {
    const event = observedSections.get(entry.target);
    campaignEvent(event);
    if (event === 'ruba_offer_view') {
      mobileNext.href = memberLink.href;
      mobileNext.textContent = '루바 공식몰 회원가입';
    }
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

observedSections.forEach((event, element) => observer.observe(element));

dialog.querySelector('[data-continue]').addEventListener('click', () => dialog.close());
