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
  let orderSum = 0;

  const updateBasket = basket => {
    allCount = Object.values(wrapperInfo)
      .reduce((acc, elem) => acc += elem.currentCount, 0)
    if (allCount > 0) {
      basket.classList.add('with-products');
      basketCount.innerHTML = allCount > 99 ? '99+' : allCount;
    }
  }
  const updBtnProducts = (btn, count) => {
    if (btn && count) {
      rerenderBtnOrder(btn, count);
      return;
    }
    btnsOrder.forEach(btn => {
      rerenderBtnOrder(btn, wrapperInfo[btn.id].currentCount);
    })
  }
  const rerenderBtnOrder = (btn, count) => {
    if (count > 0) {
      btn.innerHTML = `в корзине: ${count}`;
    }
    if (count === 0) {
      btn.innerHTML = `купить`;
    }
  }
  const updateLocalStorage = () => {
    for (const wrap in wrapperInfo) {
      localStorage.setItem(wrap, JSON.stringify(wrapperInfo[wrap]))
    }
    updateOrderSum();
  }
  const updateOrderSum = () => {
    orderSum = 0;
    for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      const ls = JSON.parse(localStorage[key]);
      orderSum += ls.weight * ls.price * ls.currentCount;
    }
    modalBtnOrder.innerHTML = orderSum > 0 ? `Оформить заказ: ${orderSum}₽` : 'Оформить заказ'
  }

  const basket = document.getElementById('basket');
  const basketCount = document.getElementById('basket-count');

  const menu = document.getElementById('menu');
  const body = document.querySelector('body');
  const menuItems = document.querySelectorAll('.menu-item');

  const btnsOrder = document.querySelectorAll('.card__btn');

  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key)) continue;
    wrapperInfo[key].currentCount = JSON.parse(localStorage[key]).currentCount;
    updBtnProducts(document.getElementById(`btn-${key}`), wrapperInfo[key].currentCount)
  }
  updateBasket(basket);

  const menuOnClick = () => {
    menu.classList.toggle('opened');
    body.classList.toggle('active');
  }
  menu.addEventListener('click', menuOnClick);

  menuItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      menuOnClick();
      document.getElementById(e.target.dataset.scroll).scrollIntoView({behavior: 'smooth', block: 'start'});
    })
  });

  btnsOrder.forEach((btn, index) =>
    btn.addEventListener('click', e => {
      const currentWrap = wrapperInfo[`wrap${index + 1}`];
      currentWrap.currentCount++;
      allCount++;

      updateLocalStorage();
      updBtnProducts(e.target, currentWrap.currentCount)
      updateBasket(basket);
    })
  );

  const modalBasket = document.getElementById('modal-basket');
  const basketModalClose = document.getElementById('basket-modal-close');
  const modalBtnOrder = document.getElementById('btn-order');
  const addBasketContent = () => {
    const basketContainer = document.getElementById('basket-content');
    basketContainer.innerHTML = Object.entries(wrapperInfo)
      .reduce((acc, wrap) => {
        const [wrapName, info] = wrap;
        if (info.currentCount < 1) return acc += '';
        return acc += ` <div class="basket-card">
                            <div class="basket-card__content">
                                <img src='img/${wrapName}.jpg' alt='${info.name}' class="basket-card__img">
                                <div class="basket-card__inner">
                                    <div class="basket-card__name">${info.name}</div>
                                    <div class="basket-card__range-block">
                                        <div class="basket-card__input">
                                            <button class="decr">-</button>
                                            <input type="text" data-key='${wrapName}' min="1" maxlength="3" autocomplete="off" readonly value='${info.currentCount}'>
                                            <button class="incr">+</button>
                                        </div>
                                        <div class="basket-card__price" data-key='${wrapName}'>${info.weight * info.price * info.currentCount}₽</div>
                                    </div>
                                </div>
                            </div>
                            <button class="basket-card__delete" data-key='${wrapName}'>×</button>
                        </div> `
      }, '');
  };
  const showEmptyBasket = () => {
    modalBasket.classList.toggle('empty-basket');
    modalBtnOrder.disabled = true;
    modalBasket.querySelector('.modal-title').innerHTML = 'Корзина пуста';
  }
  const updateBasketContent = (wrapName, info) => {
    const priceNode = document.querySelector(`.basket-card__price[data-key="${wrapName}"]`);
    if (!priceNode) return;
    const sum = info.weight * info.price * info.currentCount;
    priceNode.innerHTML = sum + '₽';
  }
  const addEventsDecrIncr = (arrayBtns, isIncr = false) => {
    arrayBtns.forEach(btn => {
      const input = btn.parentNode.querySelector('input');
      btn.addEventListener('click', () => {
        if (isIncr) {
          input.value = Number(input.value) + 1;
        } else {
          if (Number(input.value) === 1) {
            const btnDel = document.querySelector(`.basket-card__delete[data-key="${input.dataset.key}"]`)
            btnDel.dispatchEvent(new Event('click'));
            return
          } else {
            input.value = Number(input.value) - 1;
          }
        }
        wrapperInfo[input.dataset.key].currentCount = Number(input.value);
        updateLocalStorage();
        updBtnProducts();
        updateBasket(basket);
        updateBasketContent(input.dataset.key, wrapperInfo[input.dataset.key]);
      })
    })
  }

  basket.addEventListener('click', () => {
    if (allCount > 0) {
      addBasketContent();

      const btnsDecr = document.querySelectorAll('.decr');
      const btnsIncr = document.querySelectorAll('.incr');
      const btnsDelete = document.querySelectorAll('.basket-card__delete');

      btnsDelete.forEach(btn => {
        btn.addEventListener('click', () => {
          wrapperInfo[btn.dataset.key].currentCount = 0;
          updateLocalStorage();
          updBtnProducts();
          updateBasket(basket);
          addBasketContent();
        })
      })
      addEventsDecrIncr(btnsDecr);
      addEventsDecrIncr(btnsIncr, true);
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

  const modalOrder = document.getElementById('modal-order');
  const orderModalClose = document.getElementById('order-modal-close');
  const productsArea = document.getElementById('hidden-products');
  const wrapperContent = document.getElementById('order-products-wrapper');

  modalBtnOrder.addEventListener('click', () => {
    const count = Object.values(wrapperInfo).reduce((acc, wrap) =>
      acc += wrap.currentCount, 0)
    if (count < 1) {
      alert("Для заказа добавьте хотя бы один товар в корзину.");
      return;
    }

    modalOrder.classList.toggle('visible')
    productsArea.value = '';
    wrapperContent.innerHTML = '';
    let cost = 0;
    Object.entries(wrapperInfo).forEach(element => {
      const [wrapName, wrapInfo] = element;
      if (wrapInfo.currentCount > 0) {
        const sum = wrapInfo.price * wrapInfo.currentCount * wrapInfo.weight;
        cost += sum;
        productsArea.value += `Товар: ${wrapInfo.name}; Кол-во: ${wrapInfo.currentCount} шт.;Сумма: ${sum}руб.;
         `;
        wrapperContent.innerHTML += `
          <div class="order-card">
              <img src="img/${wrapName}.jpg" alt="${wrapInfo.name}" class="order-card__img">
              <div class="order-card__text-wrapper">
                  <p class="order-card__product-name">${wrapInfo.name}</p>
                  <div class="order-card__summary">
                      <p class="order-card__amount">Кол-во: <span>${wrapInfo.currentCount}</span></p>
                      <p class="order-card__price">${sum} ₽</p>
                  </div>
              </div>
          </div>
        `;
      }
      document.querySelector('.group-summary__cost').innerHTML = `${cost} ₽`;
      document.getElementById('total-cost').value = `${cost} ₽`;
    })
  })


  modalOrder.addEventListener('click', e => {
    const target = e.target;
    if (target === modalOrder || target === orderModalClose) {
      modalOrder.classList.toggle('visible');
      body.classList.remove('open-modal');
    }
  });

  const form = document.getElementById("my-form");
  const btnAcceptOrder = document.getElementById('my-form-button');

  async function handleSubmit(event) {
    event.preventDefault();
    btnAcceptOrder.disabled = true;
    const status = document.getElementById("my-form-status");
    const data = new FormData(event.target);

    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      status.innerHTML = "Спасибо за заказ!";
      form.reset()
    }).catch(error => {
      status.innerHTML = "Что-то пошло не так."
    }).finally(() => {
      btnAcceptOrder.disabled = false;
      selectReceipt.dispatchEvent(new Event('change'));
    });
  }

  form.addEventListener("submit", handleSubmit)

  const addClassesHidden = arrayNodes => {
    arrayNodes.forEach(input => input.classList.add('hidden'));
  }
  const removeClassesHidden = arrayNodes => {
    arrayNodes.forEach(input => input.classList.remove('hidden'));
  }

  const selectReceipt = document.getElementById('receipt');
  selectReceipt.addEventListener('change', e => {
      const receiptValue = e.target.value;
      const inputsPickup = document.querySelectorAll('.receipt-pickup');
      const inputsDelivery = document.querySelectorAll('.receipt-delivery');
      const isPickup = receiptValue === 'Самовывоз';
      addClassesHidden(isPickup ? inputsDelivery : inputsPickup);
      removeClassesHidden(isPickup ? inputsPickup : inputsDelivery);

      const deliveryAddress = document.querySelector('.receipt-delivery');
      deliveryAddress.querySelector('input').required = !isPickup;
      if (isPickup) {
        deliveryAddress.querySelector('label').classList.remove('required');
      } else {
        deliveryAddress.querySelector('label').classList.add('required');
      }
    }
  )
  selectReceipt.dispatchEvent(new Event('change'));

  const checkAgree = document.getElementById('agree');
  checkAgree.addEventListener('click', e => {
    btnAcceptOrder.disabled = !e.target.checked;
  });


};
