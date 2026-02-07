helpers.bindHeaderSearch('globalSearch', 'globalQuery');

$(function () {
  // Карусель
  const $slides = $('#carousel img'); let i = 0;
  setInterval(() => { $slides.removeClass('active'); i = (i + 1) % $slides.length; $slides.eq(i).addClass('active'); }, 3000);
  
  // Новинки (по году)
  const $list = $('#homeList');
  [...DB].sort((a, b) => b.year - a.year).slice(0, 12).forEach(b => {
    $list.append(`
      <article class="card book-card">
        <img src="${b.cover}" alt="">
        <div class="p-3">
          <div class="meta">${b.author} • ${b.genre} • ${b.year}</div>
          <strong>${b.title}</strong>
          <div class="meta">${helpers.stars(b.rating)} • ${b.reviews} reviews</div>
          <div class="row row--bottom">
            <div class="price">${helpers.money(b.price)}</div>
            <div class="row">
              <a class="btn btn-light" href="books.html?id=${b.id}">Details</a>
              <button class="btn btn-primary" onclick="helpers.addToCart('${b.id}')">Buy</button>
            </div>
          </div>
        </div>
      </article>
    `);
  });
});
