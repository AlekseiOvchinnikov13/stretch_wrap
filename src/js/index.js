window.onload = () => {
  const menu = document.getElementById('menu');
  const body = document.querySelector('body');

  const menuOnClick = e => {
    menu.classList.toggle('opened');
    body.classList.toggle('active');
  }
  menu.addEventListener('click', menuOnClick);

  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item =>
    item.addEventListener('click', e => {
      e.preventDefault();
      menuOnClick();
      document.getElementById(e.target.dataset.scroll).scrollIntoView({behavior: 'smooth', block: 'start'});
    })
  );
};
