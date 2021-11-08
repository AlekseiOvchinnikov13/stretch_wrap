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

  const updateBasket = basket => {
    allCount = Object.values(wrapperInfo)
      .reduce((acc, elem) => acc += elem.currentCount, 0)
    if (allCount > 0) {
      basket.classList.add('with-products');
      basketCount.innerHTML = allCount > 99 ? '99+' : allCount;
    }
  }

  const updBtnProducts = (btn, count) => {
    if (count > 0) {
      btn.innerHTML = `в корзине: ${count}`;
    }
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
    }
  );

  btnsOrder.forEach((btn, index) =>
    btn.addEventListener('click', e => {
      const currentWrap = wrapperInfo[`wrap${index + 1}`];
      currentWrap.currentCount++;
      allCount++;

      updBtnProducts(e.target, currentWrap.currentCount)
      updateBasket(basket);

      setTimeout(() => {
        for (const wrap in wrapperInfo) {
          localStorage.setItem(wrap, JSON.stringify(wrapperInfo[wrap]))
        }
      }, 0)
    })
  );

  const modalBasket = document.getElementById('modal-basket');
  const basketModalClose = document.getElementById('basket-modal-close');

  const addBasketContent = () => {
    const basketContainer = document.getElementById('basket-content');
    const productsContent = Object.entries(wrapperInfo)
      .reduce((acc, wrap) => {
        const [wrapName, info] = wrap;
        if (info.currentCount < 1) return acc += '';
        return acc += ` <div class="basket-card">
                            <img src='img/${wrapName}.jpg' alt='${info.name}' class="basket-card__img">
                            <div class="basket-card__inner">
                                <div class="basket-card__name">${info.name}</div>
                                <div class="basket-card__range-block">
                                    <div class="basket-card__input"></div>
                                    <div class="basket-card__price">${info.weight * info.price * info.currentCount}₽</div>
                                </div>
                            </div>
                            <button class="basket-card__delete" data-key='${wrapName}'>×</button>
                        </div> `
      }, '')
    basketContainer.innerHTML = productsContent;
  };

  basket.addEventListener('click', () => {
    if (allCount > 0) {
      addBasketContent();
    }
    modalBasket.classList.toggle('visible')
  });

  modalBasket.addEventListener('click', e => {
    const target = e.target;
    if (target === modalBasket || target === basketModalClose) {
      modalBasket.classList.toggle('visible');
    }
  });
};
