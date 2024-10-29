import { modalController } from './controllers/modalController';
import { initFormSubmitHandler } from './controllers/formController';

modalController({
  modal: '.modal',
  btnOpen: '.section__button',
  btnClose: '.modal__close'
});

modalController({
  modal: '.modal2',
  btnOpen: '.buy__button',
  btnClose: '.modal__close'
});

initFormSubmitHandler('.end.order', 'input[type="text"]', '.hidden');

  