export const scrollController = {
    scrollPosition: 0,
    disabledScroll(): void {
      this.scrollPosition = window.scrollY;
      document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${this.scrollPosition}px;
        left: 0;
        height: 100vh;
        width: 100vw;
      `;
    },
    enabledScroll(): void {
      document.body.style.cssText = 'position: relative;';
      window.scroll({ top: this.scrollPosition });
    }
};
  