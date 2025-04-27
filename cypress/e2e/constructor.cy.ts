import * as orderFixture from '../fixtures/order.json';
import { SELECTORS } from '../support/selectors';
describe('E2E тест конструктора бургеров', () => {
  beforeEach(() => {
    // Перехват запросов на получение ингредиентов
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

    cy.visit('/');
  });

  it('Список ингредиентов доступен для выбора', () => {
    cy.get(SELECTORS.ingredients.bun).should('have.length.at.least', 1);
    cy.get(`${SELECTORS.ingredients.main},${SELECTORS.ingredients.sauce}`).should(
      'have.length.at.least',
      1
    );
  });

  describe('Проверка работы модальных окон описаний ингредиентов', () => {
    describe('Проверка открытия модальных окон', () => {
      it('Базовое открытие по карточке ингредиента', () => {
        cy.get(`${SELECTORS.ingredients.bun}:first-of-type`).click();
        cy.get(`${SELECTORS.modals}`).children().should('have.length', 2);
      });

      it('Модальное окно с ингредиентом будет открыто после перезагрузки страницы', () => {
        cy.get(`${SELECTORS.ingredients.bun}:first-of-type`).click();
        cy.reload(true);
        cy.get(`${SELECTORS.modals}`).children().should('have.length', 2);
      });
    });

    describe('Проверка закрытия модальных окон', () => {
      it('Через нажатие на крестик', () => {
        cy.get(`${SELECTORS.ingredients.bun}:first-of-type`).click();
        cy.get(`${SELECTORS.modal.closeButton}`).click();
        cy.wait(500);
        cy.get(`${SELECTORS.modals}`).children().should('have.length', 0);
      });

      it('Через нажатие на оверлей', () => {
        cy.get(`${SELECTORS.ingredients.bun}:first-of-type`).click();
        cy.get(`${SELECTORS.modal.overlay}`).click({ force: true });
        cy.wait(500);
        cy.get(`${SELECTORS.modals}`).children().should('have.length', 0);
      });

      it('Через нажатие на Escape', () => {
        cy.get(`${SELECTORS.ingredients.bun}:first-of-type`).click();
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get(`${SELECTORS.modals}`).children().should('have.length', 0);
      });
    });
  });

  describe('Процесс оформления заказа', () => {
    beforeEach(() => {
      // Перед выполнением теста создания заказа в localStorage и сookie подставляются фейковые токены авторизации
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      // Перехват запросов на проверку авторизации, оформление заказа и получения ингредиентов
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Базовая процедура оформления ПОСЛЕ авторизации', () => {
      // Проверка работы конструктора, по умолчанию он отключен пока не будет выбрана хотя бы 1 ингредиент и булка
      cy.get(SELECTORS.orderButton).should('be.disabled');
      cy.get(
        `${SELECTORS.ingredients.bun}:first-of-type button`
      ).click();
      cy.get(SELECTORS.orderButton).should('be.disabled');
      cy.get(
        `${SELECTORS.ingredients.main}:first-of-type button`
      ).click();
      cy.get(SELECTORS.orderButton).should('be.enabled');

      // Нажатие на саму кнопку оформления заказа
      cy.get(SELECTORS.orderButton).click();

      // После успешной отправки данных на сервер должно быть открыто модальное окно с оформлением заказа
      cy.get(SELECTORS.modals).children().should('have.length', 2);

      // Новое модальное окно должно содержать тестовый номер заказа
      cy.get(SELECTORS.modal.header).should(
        'have.text',
        orderFixture.order.number
      );

      // После успешной отправки данных на сервер конструктор должен быть очищен и кнопка оформления должна стать автоматически отключенной
      cy.get(SELECTORS.orderButton).should('be.disabled');
    });

    afterEach(() => {
      // Очистка фейковых токенов
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
