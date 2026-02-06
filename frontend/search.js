helpers.bindHeaderSearch('globalSearch','globalQuery');

$(function(){
  const initialQ = helpers.qs('q') || '';
  $('#globalQuery').val(initialQ);

  // Популярные авторы
  const freq={}; DB.forEach(b=>{freq[b.author]=(freq[b.author]||0)+1;});
  const popular = Object.keys(freq).sort((a,b)=>freq[b]-freq[a]).slice(0,6);
  popular.forEach(a=>{
    $('#authorsBox').append(`<label class="row" style="align-items:center"><input type="checkbox" class="author" value="${a}"> ${a}</label>`);
  });

  function render(){
    let items=[...DB];
    const q=($('#globalQuery').val()||'').trim().toLowerCase();
    if(q){
      $('#hint').text(`Search: "${q}"`);
      items = items.filter(b => b.title.toLowerCase().includes(q) ||
                                b.author.toLowerCase().includes(q) ||
                                b.genre.toLowerCase().includes(q));
    }else $('#hint').text('Use search to filter results.');

    const authors=$('.author:checked').map((i,x)=>x.value).get();
    if(authors.length) items=items.filter(b=>authors.includes(b.author));

    const minR=parseFloat($('#minRating').val()||0);
    items=items.filter(b=>b.rating>=minR);

    const sort=$('#sort').val();
    items.sort((a,b)=>{
      if(sort==='az') return a.title.localeCompare(b.title);
      if(sort==='rating') return b.rating-a.rating;
      if(sort==='reviews') return b.reviews-a.reviews;
      if(sort==='author') return a.author.localeCompare(b.author);
      if(sort==='year') return b.year-a.year;
      return 0;
    });

    const $box=$('#results').empty();
    if(!items.length) return $box.html('<div class="muted">Nothing found…</div>');
    items.forEach(b=>{
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
  }

  $('#filters').on('input change','input,select',render);
  $('#reset').on('click',()=>{$('.author').prop('checked',false); $('#minRating').val(0); $('#sort').val('az'); render();});
  render();
});
