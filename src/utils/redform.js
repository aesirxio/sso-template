export function redFormSubmit(element) {
  var btnSubmit = document.querySelector(element);
  if (btnSubmit) {
    btnSubmit.addEventListener('click', function () {
      btnSubmit.querySelector('input').click();
    });
  }
}
