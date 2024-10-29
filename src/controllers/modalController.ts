import { ModalControllerOptions } from '../types/modalTypes';
import { scrollController } from './scrollController';

export const modalController = ({ modal, btnOpen, btnClose }: ModalControllerOptions): void => {
  const modalElem = document.querySelector(modal) as HTMLElement;
  const buttons = document.querySelectorAll(btnOpen);

  modalElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
  `;

  const closeModal = (event: MouseEvent | KeyboardEvent): void => {
    const target = event.target as HTMLElement;

    if (target === modalElem || target.closest(btnClose) || (event instanceof KeyboardEvent && event.code === 'Escape')) {
      modalElem.style.opacity = '0';
      setTimeout(() => {
        modalElem.style.visibility = 'hidden';
        scrollController.enabledScroll();
      }, 300);
    }
  };

  const openModal = (): void => {
    modalElem.style.visibility = 'visible';
    modalElem.style.opacity = '1';
    window.addEventListener('keydown', closeModal);
    scrollController.disabledScroll();
  };

  buttons.forEach(button => button.addEventListener('click', openModal));
  modalElem.addEventListener('click', closeModal);
};
