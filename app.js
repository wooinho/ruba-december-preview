const scenes = {
  errands: ["장보기", "장보는 시간에도 할 수 있는 피부 관리.", "패치를 붙이고 장을 보세요. 장바구니를 들고 식료품을 고르는 동안에도 두 손을 자유롭게 쓸 수 있습니다."],
  studio: ["필라테스", "수업 전 잠깐, 나를 위한 시간.", "필라테스 수업에 조금 일찍 도착한 날, 매트를 준비하고 수업을 기다리는 동안 루바로 피부 관리를 시작해 보세요."],
  daily: ["관리 후 일상", "집으로 돌아와 챙기는 나만의 루틴.", "세안 후 평소 피부 관리 루틴을 이어가고 싶은 날, 루바를 붙이고 저녁을 준비해 보세요. 별도의 피부 시술을 받았다면 사용 시점은 전문가 안내와 제품 설명서를 확인하세요."],
  commute: ["출근길", "아침 얼굴 붓기가 신경 쓰이는 출근길.", "아침에 거울을 보고 얼굴 붓기가 신경 쓰였나요? 대중교통으로 이동하는 시간을 활용해 루바를 붙이고 간편하게 피부 관리 루틴을 챙겨보세요."],
  cafe: ["카페 업무", "일에 집중하는 동안에도, 피부 관리는 계속.", "카페에서 노트북을 펼치기 전에 루바를 붙여보세요. 키보드를 두드리고 커피를 마시는 동안에도 피부 관리 루틴을 이어갈 수 있습니다."],
  walk: ["산책", "하루를 마무리하는 산책과 피부 관리.", "동네를 천천히 걷는 저녁, 루바를 붙이고 평소처럼 산책해 보세요. 피부 관리를 위해 시간을 따로 내기 어려운 날에 활용할 수 있습니다."]
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
