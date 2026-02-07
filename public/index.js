helpers.bindHeaderSearch('globalSearch', 'globalQuery');

$(async function () {
  // Carousel
  const $slides = $('#carousel img'); let i = 0;
  setInterval(() => { 
    $slides.removeClass('active'); 
    i = (i + 1) % $slides.length; 
    $slides.eq(i).addClass('active'); 
  }, 3000);
  
  // FETCH BOOKS FROM API
  const $list = $('#homeList');
  $list.html('<div class="meta">Loading new books...</div>');

  // Fetch books sorted by year (newest first)
  const books = await helpers.api('/books?sort=year');

  $list.empty();
  
  if (!Array.isArray(books) || !books.length) {
    return $list.html('<div class="meta">No books found in database.</div>');
  }

  books.slice(0, 12).forEach(b => {
    $list.append(`
      <article class="card book-card">
        <img src="${b.cover}" alt="">
        <div class="p-3">
          <div class="meta">${b.author} • ${b.genre} • ${b.year}</div>
          <strong>${b.title}</strong>
          <div class="meta">${helpers.stars(b.rating)} • ${b.reviewsCount} reviews</div>
          <div class="row row--bottom">
            <div class="price">${helpers.money(b.price)}</div>
            <div class="row">
              <a class="btn btn-light" href="books.html?id=${b._id}">Details</a>
              <button class="btn btn-primary" onclick="helpers.addToCart('${b._id}')">Buy</button>
            </div>
          </div>
        </div>
      </article>
    `);
  });
});