// cypress/support/selectors.ts
// Константы для повторяющихся селекторов
export const SELECTORS = {
    ingredients: {
      bun: '[data-ingredient="bun"]',
      main: '[data-ingredient="main"]',
      sauce: '[data-ingredient="sauce"]',
    },
    orderButton: '[data-order-button]',
    modals: '#modals',
    modal: {
      closeButton: '#modals button:first-of-type',
      overlay: '#modals > div:nth-of-type(2)',
      header: '#modals h2:first-of-type',
    },
  };