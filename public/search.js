helpers.bindHeaderSearch('globalSearch','globalQuery');

$(async function(){
  // Read URL params
  const initialQ = helpers.qs('q') || '';
  $('#globalQuery').val(initialQ);

  $('#authorsBox').closest('div').hide(); 

  // RENDER FUNCTION 
  async function render(){
    const q = $('#globalQuery').val().trim();
    const minRating = $('#minRating').val();
    const sort = $('#sort').val();
    
    $('#hint').text(q ? `Search results for: "${q}"` : 'All books');
    $('#results').html('<div class="meta">Searching...</div>');

    // Build API URL
    let url = `/books?sort=${sort}`;
    if(q) url += `&q=${encodeURIComponent(q)}`;
    if(minRating > 0) url += `&minRating=${minRating}`;

    const books = await helpers.api(url);

    const $box = $('#results').empty();
    
    if(!Array.isArray(books) || !books.length) {
      return $box.html('<div class="muted">Nothing found…</div>');
    }

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
  }

  // Events
  $('#filters').on('change','input,select', render);
  $('#globalSearch').on('submit', (e) => { e.preventDefault(); render(); }); // Override header search to render in-place if we are already on search page
  
  $('#reset').on('click', () => {
    $('#minRating').val(0); 
    $('#sort').val('az'); 
    $('#globalQuery').val('');
    render();
  });

  render();
});