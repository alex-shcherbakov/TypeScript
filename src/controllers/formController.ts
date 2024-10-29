export const initFormSubmitHandler = (submitButtonSelector: string, inputSelector: string, messageSelector: string): void => {
    const submitButton = document.querySelector(submitButtonSelector) as HTMLElement;
    const inputFields = document.querySelectorAll(inputSelector) as NodeListOf<HTMLInputElement>;
    const messageElement = document.querySelector(messageSelector) as HTMLElement;
  
    submitButton.addEventListener('click', () => {
      const allFieldsFilled = Array.from(inputFields).every(input => input.value.trim() !== '');
  
      if (allFieldsFilled) {
        messageElement.classList.remove('hidden');
      }
    });
};
  