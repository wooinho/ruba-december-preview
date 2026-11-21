const scenes = {
  errands: ["장보기", "장을 보는 동안, 손은 자유롭게.", "장을 보러 나서는 일상에 붙이는 관리. 양손으로 장바구니를 들고 하던 일을 이어갑니다."],
  studio: ["필라테스", "클래스 전, 준비하는 시간에.", "스튜디오에 조금 일찍 도착한 날. 가방을 정리하고 수업을 기다리는 시간에 관리를 시작합니다."],
  daily: ["관리 후 일상", "평소 루틴으로 돌아오는 날.", "피부 관리를 받은 직후의 사용 가능 여부는 전문가 안내와 제품 사용설명서에 따라 확인하세요."],
  commute: ["출근길", "하루를 시작하는 출근길에.", "대중교통으로 이동하는 아침. 가방을 들고 일정을 확인하는 동안 두 손은 자유롭습니다."],
  cafe: ["카페 업무", "키보드를 두드리는 동안에도.", "카페에서 노트북을 펼치는 시간. 패치를 붙이고 하던 일을 이어갑니다."],
  walk: ["산책", "가볍게 걷는 저녁에.", "동네를 한 바퀴 걷는 시간에도, 기기를 계속 손에 들고 있을 필요가 없습니다."]
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
