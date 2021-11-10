window.onload = () => {

  const wrapperInfo = {
    wrap1: {
      name: 'Стрейч-пленка первичная, ручная',
      price: 230,
      weight: 2,
      currentCount: 0
    },
    wrap2: {
      name: 'Стрейч-пленка вторичная, ручная',
      price: 175,
      weight: 2,
      currentCount: 0
    },
    wrap3: {
      name: 'Стрейч-пленка первичная, машинная',
      price: 220,
      weight: 16,
      currentCount: 0
    },
    wrap4: {
      name: 'Техническая пленка ПВД',
      price: 120,
      weight: 27.6,
      currentCount: 0
    }
  }
  let allCount = 0;
  let allCost = 0;

  const body = document.body;

  /**
   * Кнопка корзины
   * @type {HTMLElement}
   */
  const basket = document.getElementById('basket');
  /**
   * Количество товаров в корзине
   * @type {HTMLElement}
   */
  const basketCount = document.getElementById('basket-count');

  /**
   * Модалка при нажатии на корзину
   * @type {HTMLElement}
   */
  const modalBasket = document.getElementById('modal-basket');
  const basketModalClose = document.getElementById('basket-modal-close');
  /**
   * Кнопка "Оформить заказ"
   * @type {HTMLElement}
   */
  const modalBtnOrder = document.getElementById('btn-order');

  /**
   * Бургер меню
   * @type {HTMLElement}
   */
  const menu = document.getElementById('menu');
  /**
   * Ссылки в меню
   * @type {NodeListOf<Element>}
   */
  const menuItems = document.querySelectorAll('.menu-item');
  /**
   * Кнопки "купить"
   * @type {NodeListOf<Element>}
   */
  const btnsOrder = document.querySelectorAll('.card__btn');

  /**
   * Модалка при нажатии на Оформление заказа
   * @type {HTMLElement}
   */
  const modalOrder = document.getElementById('modal-order');
  const orderModalClose = document.getElementById('order-modal-close');

  /**
   * Поле товаров для письма
   * @type {HTMLElement}
   */
  const productsArea = document.getElementById('hidden-products');

  /**
   * Форма отправки
   * @type {HTMLElement}
   */
  const form = document.getElementById("my-form");
  /**
   * Кнопка подтверждения заказа
   * @type {HTMLElement}
   */
  const btnAcceptOrder = document.getElementById('my-form-button');

  /**
   * Обертка для отрисовки наполнения заказа
   * @type {HTMLElement}
   */
  const wrapperContent = document.getElementById('order-products-wrapper');

  /**
   * Чек бокс на обработку данных
   * @type {HTMLElement}
   */
  const checkAgree = document.getElementById('agree');
  /**
   * Выпадающий список со способами доставки
   * @type {HTMLElement}
   */
  const selectReceipt = document.getElementById('receipt');

  checkAgree.addEventListener('click', e => {
    btnAcceptOrder.disabled = !e.target.checked;
  });


  /**
   *Обновить значок корзины
   */
  const updateBasket = () => {
    updateTotalCount();
    if (allCount > 0) {
      basket.classList.add('with-products');
      basketCount.innerHTML = allCount > 99 ? '99+' : allCount;
    }
  }

  /**
   * Обновить все кнопки "Купить"
   */
  const updBtnProducts = () => {
    btnsOrder.forEach(btn => {
      rerenderBtnOrder(btn, getItemByKey(btn.id).currentCount);
    })
  }

  /**
   * Обновить надпись на кнопке "купить"
   * @param btn
   * @param count
   */
  const rerenderBtnOrder = (btn, count) => {
    if (count > 0) {
      btn.innerHTML = `в корзине: ${count}`;
    }
    if (count === 0) {
      btn.innerHTML = `купить`;
    }
  }

  /**
   * Обновить количество товаров в корзине
   */
  const updateTotalCount = () => {
    allCount = 0;
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      allCount += getItemByKey(key).currentCount;
    }
  }

  /**
   * Обновить итоговую сумму заказа
   */
  const updateTotalCost = () => {
    allCost = 0;
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      const wrap = getItemByKey(key);
      allCost += wrap.currentCount * wrap.weight * wrap.price;
      allCost = Math.ceil(allCost);
    }
  }

  /**
   * Логика отправки формы
   * @param event
   * @return {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();
    btnAcceptOrder.disabled = true;
    const data = new FormData(event.target);
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      btnAcceptOrder.innerHTML = "Спасибо за заказ!";
      form.reset();
      localStorage.clear();
      init();
    }).catch(error => {
      btnAcceptOrder.innerHTML = "Что-то пошло не так."
    }).finally(() => {
      btnAcceptOrder.disabled = false;
      selectReceipt.dispatchEvent(new Event('change'));
    });
  }

  form.addEventListener("submit", handleSubmit)

  /**
   * Скрыть поля ввода способов доставки
   * @param arrayNodes
   */
  const addClassesHidden = arrayNodes => {
    arrayNodes.forEach(input => input.classList.add('hidden'));
  }
  /**
   * Показать поля ввода способов доставки
   * @param arrayNodes
   */
  const removeClassesHidden = arrayNodes => {
    arrayNodes.forEach(input => input.classList.remove('hidden'));
  }

  /**
   * Обновить поля ввода для способов доставки
   * @param isPickup
   * @param inputsDelivery
   * @param inputsPickup
   */
  const updateDeliveryFields = (isPickup, inputsDelivery, inputsPickup) => {
    addClassesHidden(isPickup ? inputsDelivery : inputsPickup);
    removeClassesHidden(isPickup ? inputsPickup : inputsDelivery);
  }

  /**
   * Обработчик открытия/закрытия меню
   */
  const menuClick = () => {
    menu.classList.toggle('opened');
    body.classList.toggle('active');
  }
  menu.addEventListener('click', menuClick);
  menuItems.forEach(item => {
    item.addEventListener('click', menuClick)
  });

  /**
   * Получить объект хранилища по ключу
   */
  const getItemByKey = key => JSON.parse(localStorage.getItem(key));

  /**
   * Записать объект в хранилище по ключу
   */
  const setItemByKey = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  /**
   * Инициализация LocalStorage
   */
  const initLocalStorage = () => {
    const products = ['wrap1', 'wrap2', 'wrap3', 'wrap4'];
    const alreadyExists = products.reduce((acc, wrap) =>
        getItemByKey(wrap) && true
      , false)
    if (alreadyExists) return;
    for (const wrap in wrapperInfo) {
      localStorage.setItem(wrap, JSON.stringify(wrapperInfo[wrap]))
    }
  }

  /**
   * Обновление контента при заходе на сайт
   */
  const init = () => {
    initLocalStorage();
    updBtnProducts();
    updateBasket();
  };
  init();

  btnsOrder.forEach((btn, index) =>
    btn.addEventListener('click', e => {
      const key = `wrap${index + 1}`;
      const wrap = getItemByKey(key);
      wrap.currentCount++;
      setItemByKey(key, wrap);
      rerenderBtnOrder(e.target, wrap.currentCount);
      updateBasket();
    })
  );

  /**
   * Отрисовка корзины
   */
  const addBasketContent = () => {
    const basketContainer = document.getElementById('basket-content');
    basketContainer.innerHTML = '';
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      const wrap = getItemByKey(key);
      if (wrap.currentCount < 1) continue;
      const price = wrap.weight * wrap.price * wrap.currentCount;
      const weight = (wrap.weight * wrap.currentCount).toFixed(1);
      basketContainer.innerHTML += `
            <div class="basket-card" id="basket-card-${key}">
                <div class="basket-card__content">
                    <img src='img/${key}.jpg' alt='${wrap.name}' class="basket-card__img">
                    <div class="basket-card__inner">
                        <div class="basket-card__name">${wrap.name}</div>
                        <div class="basket-card__range-block">
                            <div class="basket-card__input">
                                <button class="decr">-</button>
                                <input type="text" data-key='${key}' maxlength="3" autocomplete="off" readonly value='${wrap.currentCount}'>
                                <button class="incr">+</button>
                            </div>
                            <div class="basket-card__price" data-key='${key}'>${price}₽ <span>|</span> ${weight}кг</div>
                        </div>
                    </div>
                </div>
                <button class="basket-card__delete" data-key='${key}'>×</button>
            </div> `;
    }

    addListenerToDeleteButtons();
    addListenerToIncrDecrButtons();
    updateBtnConfirm();
  };

  const addListenerToDeleteButtons = () => {
    const btnsDelete = document.querySelectorAll('.basket-card__delete');

    btnsDelete.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const wrap = getItemByKey(key);
        wrap.currentCount = 0;
        setItemByKey(key, wrap);
        updateBtnConfirm();
        updBtnProducts();
        updateBasket();
        deleteNodeByKey(key);
      })
    })
  }

  /**
   * Удалить Node по Key
   */
  const deleteNodeByKey = key => {
    const node = document.getElementById(`basket-card-${key}`)
    node.parentNode.removeChild(node);
  }

  const addEventsDecrIncr = (arrayBtns, isIncr = false) => {
    arrayBtns.forEach(btn => {
      const input = btn.parentNode.querySelector('input');
      const key = input.dataset.key;
      let isDel = false;
      btn.addEventListener('click', () => {
        if (isIncr) {
          input.value++;
        } else {
          if (Number(input.value) === 1) {
            const btnDel = document.querySelector(`.basket-card__delete[data-key="${key}"]`)
            btnDel.dispatchEvent(new Event('click'));
            isDel = true;
          } else {
            input.value--;
          }
        }
        const wrap = getItemByKey(key);
        if (!isDel) wrap.currentCount = Number(input.value);
        setItemByKey(key, wrap);
        updBtnProducts();
        updateBasket();

        updateBasketContent(key);
      })
    })
  }

  /**
   * Обновить наполнение корзины
   */
  const updateBasketContent = (key) => {
    const wrap = getItemByKey(key);
    const priceNode = document.querySelector(`.basket-card__price[data-key="${key}"]`);
    const sum = wrap.weight * wrap.price * wrap.currentCount;

    if (priceNode) {
      const weight = (wrap.weight * wrap.currentCount).toFixed(1);
      priceNode.innerHTML = `${sum}₽ <span>|<span> ${weight}кг`;
    }
    updateBtnConfirm();
  }

  /**
   * Обновить кнопку подтверждения заказа
   */
  const updateBtnConfirm = () => {
    updateTotalCost();
    modalBtnOrder.innerHTML = `Оформить заказ: ${allCost}₽`;
  };

  const addListenerToIncrDecrButtons = () => {
    const btnsDecr = document.querySelectorAll('.decr');
    const btnsIncr = document.querySelectorAll('.incr');

    addEventsDecrIncr(btnsDecr);
    addEventsDecrIncr(btnsIncr, true);
  }

  /**
   * Показать пустую корзину
   */
  const showEmptyBasket = () => {
    modalBasket.classList.toggle('empty-basket');
    modalBtnOrder.disabled = true;
    modalBasket.querySelector('.modal-title').innerHTML = 'Корзина пуста';
  }

  basket.addEventListener('click', () => {
    if (allCount > 0) {
      addBasketContent();
    } else {
      showEmptyBasket();
    }
    body.classList.add('open-modal');
    modalBasket.classList.toggle('visible')
  });
  modalBasket.addEventListener('click', e => {
    const target = e.target;
    if (target === modalBasket || target === basketModalClose || target === modalBtnOrder) {
      if (!(target === modalBtnOrder)) {
        body.classList.remove('open-modal');
      }
      modalBasket.classList.toggle('visible');
      modalBasket.classList.remove('empty-basket');
      modalBtnOrder.disabled = false;
      modalBasket.querySelector('.modal-title').innerHTML = 'Корзина';
    }
  });

  modalOrder.addEventListener('click', e => {
    const target = e.target;
    if (target === modalOrder || target === orderModalClose) {
      modalOrder.classList.toggle('visible');
      body.classList.remove('open-modal');
    }
  });

  modalBtnOrder.addEventListener('click', () => {
    if (allCost < 1 || allCount < 1) {
      alert("Для заказа добавьте хотя бы один товар в корзину.");
      return;
    }

    modalOrder.classList.toggle('visible')
    productsArea.value = '';
    wrapperContent.innerHTML = '';
    updateTotalCost();
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      const wrap = getItemByKey(key);
      if (wrap.currentCount < 1) continue;

      const sum = Math.ceil(wrap.price * wrap.currentCount * wrap.weight);
      productsArea.value += `Товар: ${wrap.name}; Кол-во: ${wrap.currentCount} шт.;Сумма: ${sum}руб.;
         `;
      wrapperContent.innerHTML += `
          <div class="order-card">
              <img src="img/${key}.jpg" alt="${wrap.name}" class="order-card__img">
              <div class="order-card__text-wrapper">
                  <p class="order-card__product-name">${wrap.name}</p>
                  <div class="order-card__summary">
                      <p class="order-card__amount">Кол-во: <span>${wrap.currentCount}</span></p>
                      <p class="order-card__price">${sum} ₽</p>
                  </div>
              </div>
          </div>
        `;
      document.querySelector('.group-summary__cost').innerHTML = `${allCost} ₽`;
      document.getElementById('total-cost').value = `${allCost} ₽`;
    }
  });

  selectReceipt.addEventListener('change', e => {
      const receiptValue = e.target.value;
      const inputsPickup = document.querySelectorAll('.receipt-pickup');
      const inputsDelivery = document.querySelectorAll('.receipt-delivery');
      const deliveryAddress = document.querySelector('.receipt-delivery');

      const isPickup = receiptValue === 'Самовывоз';
      updateDeliveryFields(isPickup, inputsDelivery, inputsPickup);

      deliveryAddress.querySelector('input').required = !isPickup;
      updateDeliveryAddressLabel(isPickup, deliveryAddress);
    }
  );
  selectReceipt.dispatchEvent(new Event('change'));

  const updateDeliveryAddressLabel = (isPickup, deliveryAddress) => {
    if (isPickup) {
      deliveryAddress.querySelector('label').classList.remove('required');
    } else {
      deliveryAddress.querySelector('label').classList.add('required');
    }
  }
};
