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
