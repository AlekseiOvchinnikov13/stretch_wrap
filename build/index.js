"use strict";function P(e,t,n,c,r,a,o){try{var i=e[a](o),d=i.value}catch(e){return void n(e)}i.done?t(d):Promise.resolve(d).then(c,r)}window.onload=function(){var t={wrap1:{name:"Стрейч-пленка первичная, ручная",price:230,weight:2,currentCount:0},wrap2:{name:"Стрейч-пленка вторичная, ручная",price:175,weight:2,currentCount:0},wrap3:{name:"Стрейч-пленка первичная, машинная",price:220,weight:16,currentCount:0},wrap4:{name:"Техническая пленка ПВД",price:120,weight:27.6,currentCount:0}},c=0,r=0,n=document.body,e=document.getElementById("basket"),a=document.getElementById("basket-count"),o=document.getElementById("modal-basket"),i=document.getElementById("basket-modal-close"),d=document.getElementById("btn-order"),u=document.getElementById("menu"),l=document.querySelectorAll(".menu-item"),s=document.querySelectorAll(".card__btn"),m=document.getElementById("modal-order"),v=document.getElementById("order-modal-close"),p=document.getElementById("hidden-products"),g=document.getElementById("my-form"),f=document.getElementById("my-form-button"),y=document.getElementById("order-products-wrapper"),h=document.getElementById("agree"),b=document.getElementById("receipt");h.addEventListener("click",function(e){f.disabled=!e.target.checked});var k=function(){_(),0<c&&(e.classList.add("with-products"),a.innerHTML=99<c?"99+":c)},E=function(){s.forEach(function(e){L(e,q(e.id).currentCount)})},L=function(e,t){0<t&&(e.innerHTML="в корзине: ".concat(t)),0===t&&(e.innerHTML="купить")},_=function(){for(var e in c=0,localStorage)localStorage.hasOwnProperty(e)&&(c+=q(e).currentCount)},w=function(){for(var e in r=0,localStorage)localStorage.hasOwnProperty(e)&&(e=q(e),r+=e.currentCount*e.weight*e.price,r=Math.ceil(r))};function S(){var i;return i=regeneratorRuntime.mark(function e(t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.preventDefault(),f.disabled=!0,n=new FormData(t.target),fetch(t.target.action,{method:g.method,body:n,headers:{Accept:"application/json"}}).then(function(e){f.innerHTML="Спасибо за заказ!",g.reset(),localStorage.clear(),B()}).catch(function(e){f.innerHTML="Что-то пошло не так."}).finally(function(){f.disabled=!1,b.dispatchEvent(new Event("change"))});case 4:case"end":return e.stop()}},e)}),(S=function(){var e=this,o=arguments;return new Promise(function(t,n){var c=i.apply(e,o);function r(e){P(c,t,n,r,a,"next",e)}function a(e){P(c,t,n,r,a,"throw",e)}r(void 0)})}).apply(this,arguments)}g.addEventListener("submit",function(e){return S.apply(this,arguments)});function C(){u.classList.toggle("opened"),n.classList.toggle("active")}u.addEventListener("click",C),l.forEach(function(e){e.addEventListener("click",C)});var q=function(e){return JSON.parse(localStorage.getItem(e))},I=function(e,t){return localStorage.setItem(e,JSON.stringify(t))},B=function(){!function(){if(!["wrap1","wrap2","wrap3","wrap4"].reduce(function(e,t){return q(t)&&!0},!1))for(var e in t)localStorage.setItem(e,JSON.stringify(t[e]))}(),E(),k()};B(),s.forEach(function(e,c){return e.addEventListener("click",function(e){var t="wrap".concat(c+1),n=q(t);n.currentCount++,I(t,n),L(e.target,n.currentCount),k()})});function M(){document.querySelectorAll(".basket-card__delete").forEach(function(n){n.addEventListener("click",function(){var e=n.dataset.key,t=q(e);t.currentCount=0,I(e,t),N(),E(),k(),A(e)})})}function H(e){var t=q(e),n=document.querySelector('.basket-card__price[data-key="'.concat(e,'"]')),e=t.weight*t.price*t.currentCount;n&&(t=(t.weight*t.currentCount).toFixed(1),n.innerHTML="".concat(e,"₽ <span>|<span> ").concat(t,"кг")),N()}function T(){var e=document.querySelectorAll(".decr"),t=document.querySelectorAll(".incr");x(e),x(t,!0)}var A=function(e){e=document.getElementById("basket-card-".concat(e));e.parentNode.removeChild(e)},x=function(e){var r=1<arguments.length&&void 0!==arguments[1]&&arguments[1];e.forEach(function(e){var t=e.parentNode.querySelector("input"),n=t.dataset.key,c=!1;e.addEventListener("click",function(){r?t.value++:1===Number(t.value)?(document.querySelector('.basket-card__delete[data-key="'.concat(n,'"]')).dispatchEvent(new Event("click")),c=!0):t.value--;var e=q(n);c||(e.currentCount=Number(t.value)),I(n,e),E(),k(),H(n)})})},N=function(){w(),d.innerHTML="Оформить заказ: ".concat(r,"₽")};e.addEventListener("click",function(){0<c?function(){var e,t,n,c,r=document.getElementById("basket-content");for(e in r.innerHTML="",localStorage)localStorage.hasOwnProperty(e)&&((t=q(e)).currentCount<1||(n=t.weight*t.price*t.currentCount,c=(t.weight*t.currentCount).toFixed(1),r.innerHTML+='\n            <div class="basket-card" id="basket-card-'.concat(e,'">\n                <div class="basket-card__content">\n                    <img src=\'img/').concat(e,".jpg' alt='").concat(t.name,'\' class="basket-card__img">\n                    <div class="basket-card__inner">\n                        <div class="basket-card__name">').concat(t.name,'</div>\n                        <div class="basket-card__range-block">\n                            <div class="basket-card__input">\n                                <button class="decr">-</button>\n                                <input type="text" data-key=\'').concat(e,'\' maxlength="3" autocomplete="off" readonly value=\'').concat(t.currentCount,'\'>\n                                <button class="incr">+</button>\n                            </div>\n                            <div class="basket-card__price" data-key=\'').concat(e,"'>").concat(n,"₽ <span>|</span> ").concat(c,'кг</div>\n                        </div>\n                    </div>\n                </div>\n                <button class="basket-card__delete" data-key=\'').concat(e,"'>×</button>\n            </div> ")));M(),T(),N()}():(o.classList.toggle("empty-basket"),d.disabled=!0,o.querySelector(".modal-title").innerHTML="Корзина пуста"),n.classList.add("open-modal"),o.classList.toggle("visible")}),o.addEventListener("click",function(e){e=e.target;e!==o&&e!==i&&e!==d||(e!==d&&n.classList.remove("open-modal"),o.classList.toggle("visible"),o.classList.remove("empty-basket"),d.disabled=!1,o.querySelector(".modal-title").innerHTML="Корзина")}),m.addEventListener("click",function(e){e=e.target;e!==m&&e!==v||(m.classList.toggle("visible"),n.classList.remove("open-modal"))}),d.addEventListener("click",function(){if(r<1||c<1)alert("Для заказа добавьте хотя бы один товар в корзину.");else for(var e in m.classList.toggle("visible"),p.value="",y.innerHTML="",w(),localStorage){var t,n;localStorage.hasOwnProperty(e)&&((t=q(e)).currentCount<1||(n=Math.ceil(t.price*t.currentCount*t.weight),p.value+="Товар: ".concat(t.name,"; Кол-во: ").concat(t.currentCount," шт.;Сумма: ").concat(n,"руб.;\n         "),y.innerHTML+='\n          <div class="order-card">\n              <img src="img/'.concat(e,'.jpg" alt="').concat(t.name,'" class="order-card__img">\n              <div class="order-card__text-wrapper">\n                  <p class="order-card__product-name">').concat(t.name,'</p>\n                  <div class="order-card__summary">\n                      <p class="order-card__amount">Кол-во: <span>').concat(t.currentCount,'</span></p>\n                      <p class="order-card__price">').concat(n," ₽</p>\n                  </div>\n              </div>\n          </div>\n        "),document.querySelector(".group-summary__cost").innerHTML="".concat(r," ₽"),document.getElementById("total-cost").value="".concat(r," ₽")))}}),b.addEventListener("change",function(e){var t=e.target.value,n=document.querySelectorAll(".receipt-pickup"),c=document.querySelectorAll(".receipt-delivery"),r=document.querySelector(".receipt-delivery"),e="Самовывоз"===t;t=c,c=n,((n=e)?t:c).forEach(function(e){return e.classList.add("hidden")}),(n?c:t).forEach(function(e){return e.classList.remove("hidden")}),r.querySelector("input").required=!e,O(e,r)}),b.dispatchEvent(new Event("change"));var O=function(e,t){e?t.querySelector("label").classList.remove("required"):t.querySelector("label").classList.add("required")}};