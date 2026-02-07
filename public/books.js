helpers.bindHeaderSearch('globalSearch','globalQuery');

$(async function(){
  const id = helpers.qs('id');
  const $root = $('#booksRoot');

  // LIST VIEW 
  if(!id){
    $root.html(`<h2 style="margin:0 0 10px">Books</h2><div class="list" id="bookList">Loading books...</div>`);
    
    const books = await helpers.api('/books'); 
    
    const $box = $('#bookList').empty();
    if(!Array.isArray(books) || !books.length) return $box.html('No books found.');

    books.forEach(b => {
      $box.append(`
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
    return;
  }

  // DETAIL VIEW 
  const b = await helpers.api(`/books/${id}`);
  if(!b || b.msg){ $root.html('<div class="muted">Book not found.</div>'); return; }

  $root.html(`
    <section class="card p-3">
      <div class="hero">
        <img src="${b.cover}" alt="">
        <div>
          <div class="meta">${b.author} • ${b.genre} • ${b.year}</div>
          <h1 style="margin:0 0 6px">${b.title}</h1>
          <div class="meta">${helpers.stars(b.rating)} • ${b.reviewsCount} reviews</div>
          <p class="price" style="margin:8px 0">${helpers.money(b.price)}</p>
          <div class="row">
            <button class="btn btn-primary" onclick="helpers.addToCart('${b._id}')">Add to cart</button>
            <a class="btn btn-light" href="checkout.html?buy=${b._id}">Buy now</a>
          </div>
        </div>
      </div>
    </section>

    <section style="margin-top:16px" class="grid" id="reviewsGrid">
      <div class="review">
        <h3 style="margin:0 0 10px">Reviews</h3>
        <div id="revList" class="grid" style="gap:10px">Loading reviews...</div>
      </div>
      <div class="review">
        <h3 style="margin:0 0 10px">Leave a review</h3>
        <div class="grid" style="gap:8px">
          <input id="rName" class="input" placeholder="Your name (optional if logged in)">
          <select id="rStars" class="select">
            <option value="5">★★★★★ (5)</option><option value="4">★★★★ (4)</option>
            <option value="3">★★★ (3)</option><option value="2">★★ (2)</option>
            <option value="1">★ (1)</option>
          </select>
          <textarea id="rText" class="input input--area" rows="5" placeholder="Your thoughts…"></textarea>
          <button id="sendReview" class="btn btn-primary">Publish</button>
        </div>
      </div>
    </section>
  `);

  function renderReviews(){
    const box = $('#revList').empty();
    if(!b.reviews || !b.reviews.length) return box.html('<div class="muted">No reviews yet.</div>');
    
    b.reviews.forEach(r => {
      box.append(`<article class="card p-3">
        <div class="meta">${r.name} • ${new Date(r.createdAt).toLocaleString()}</div>
        <div class="stars">${helpers.stars(r.rating)}</div>
        <p style="margin:6px 0 0">${$('<div>').text(r.text).html()}</p>
      </article>`);
    });
  }
  
  $('#sendReview').on('click', async () => {
    if(!helpers.isLogged()) return alert('You must be logged in to review.');
    
    const text = $('#rText').val().trim();
    if(!text) return alert('Write something');
    
    const user = helpers.getUser();
    
    const res = await helpers.api(`/books/${id}/reviews`, 'POST', {
      name: $('#rName').val().trim() || user.firstName,
      rating: +$('#rStars').val(),
      text: text
    });
    
    if(Array.isArray(res)) {
      alert('Review published!');
      location.reload();
    } else {
      alert(res.msg || 'Error posting review');
    }
  });

  renderReviews();
});