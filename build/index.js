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
      price: 225,
      weight: 16,
      currentCount: 0
    },
    wrap4: {
      name: 'Техническая пленка ПВД',
      price: 120,
      weight: 2,
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
    modalBasket.classList.toggle('visible')
  });

  modalBasket.addEventListener('click', e => {
    const target = e.target;
    if (target === modalBasket || target === basketModalClose || target === modalBtnOrder) {
      modalBasket.classList.toggle('visible');
      modalBasket.classList.remove('empty-basket');
      modalBtnOrder.disabled = false;
      modalBasket.querySelector('.modal-title').innerHTML = 'Корзина';
    }
  });

  const modalOrder = document.getElementById('modal-order');

  modalBtnOrder.addEventListener('click', () => {
    const count = Object.values(wrapperInfo).reduce((acc, wrap) =>
      acc += wrap.currentCount, 0)
    if (count < 1) {
      alert("Для заказа добавьте хотя бы один товар в корзину.");
      return;
    }
    modalOrder.classList.toggle('visible')
  })
};
