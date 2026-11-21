const application = document.querySelector('#trial-application');
const preview = document.querySelector('#application-preview');
const previewTitle = document.querySelector('#application-preview-title');
const instagram = document.querySelector('#instagram');

application.addEventListener('submit', event => {
  event.preventDefault();
  preview.hidden = false;
  application.hidden = true;
  previewTitle.focus();
});

document.querySelector('#preview-back').addEventListener('click', () => {
  preview.hidden = true;
  application.hidden = false;
  instagram.focus();
});
