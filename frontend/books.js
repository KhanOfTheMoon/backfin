helpers.bindHeaderSearch('globalSearch','globalQuery');

$(function(){
  const id = helpers.qs('id');
  const $root = $('#booksRoot');

  // список
  if(!id){
    $root.html(`<h2 style="margin:0 0 10px">Books</h2><div class="list" id="bookList"></div>`);
    const $box = $('#bookList');
    [...DB].sort((a,b)=>b.rating-a.rating).forEach(b=>{
      $box.append(`
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
    return;
  }

  // детально
  const b = DB.find(x=>x.id===id);
  if(!b){ $root.html('<div class="muted">Book not found.</div>'); return; }

  $root.html(`
    <section class="card p-3">
      <div class="hero">
        <img src="${b.cover}" alt="">
        <div>
          <div class="meta">${b.author} • ${b.genre} • ${b.year}</div>
          <h1 style="margin:0 0 6px">${b.title}</h1>
          <div class="meta">${helpers.stars(b.rating)} • ${b.reviews} reviews</div>
          <p class="price" style="margin:8px 0">${helpers.money(b.price)}</p>
          <div class="row">
            <button class="btn btn-primary" onclick="helpers.addToCart('${b.id}')">Add to cart</button>
            <a class="btn btn-light" href="checkout.html?buy=${b.id}">Buy now</a>
          </div>
        </div>
      </div>
    </section>

    <section style="margin-top:16px" class="grid" id="reviewsGrid">
      <div class="review">
        <h3 style="margin:0 0 10px">Reviews</h3>
        <div id="revList" class="grid" style="gap:10px"></div>
      </div>
      <div class="review">
        <h3 style="margin:0 0 10px">Leave a review</h3>
        <div class="grid" style="gap:8px">
          <input id="rName" class="input" placeholder="Your name">
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
    const arr = helpers.getReviews(id);
    const box = $('#revList').empty();
    if(!arr.length) return box.html('<div class="muted">No reviews yet.</div>');
    arr.slice().reverse().forEach(r=>{
      box.append(`<article class="card p-3">
        <div class="meta">${r.name} • ${new Date(r.ts).toLocaleString()}</div>
        <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
        <p style="margin:6px 0 0">${$('<div>').text(r.text).html()}</p>
      </article>`);
    });
  }
  $('#sendReview').on('click',()=>{
    const name = $('#rName').val().trim() || (helpers.getUser()?.firstName || 'Reader');
    const stars = +$('#rStars').val();
    const text = $('#rText').val().trim();
    if(!text) return alert('Write something');
    helpers.addReview(id,{name,stars,text,ts:Date.now()});
    $('#rText').val(''); renderReviews();
  });
  renderReviews();
});
