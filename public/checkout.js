helpers.bindHeaderSearch('globalSearch','globalQuery');

$(async function(){
  // If "Buy Now" clicked, add to cart immediately
  const buyId = helpers.qs('buy');
  if(buyId) helpers.addToCart(buyId);

  const cartIds = helpers.getCart();
  const $items = $('#items'); 
  let total = 0;

  if(!cartIds.length){
    $items.html('<div class="meta">Cart is empty.</div>');
    $('#place').prop('disabled',true);
  } else {
    $items.html('Loading cart items...');
    
    const promises = cartIds.map(id => helpers.api(`/books/${id}`));
    const books = await Promise.all(promises);
    
    $items.empty();
    
    books.forEach(b => {
      if(!b || b.msg) return; // Skip if deleted/error
      total += b.price;
      $items.append(`
        <div class="row" style="justify-content:space-between;align-items:center;margin-bottom:8px">
          <div class="row" style="align-items:center; gap:10px">
            <img src="${b.cover}" style="width:44px;height:60px;object-fit:cover;border-radius:6px;border:1px solid var(--line)">
            <div style="max-width:360px">${b.title}</div>
          </div>
          <div>${helpers.money(b.price)}</div>
        </div>
      `);
    });
    
    $('#sum').html(`<span>Total</span><span>${helpers.money(total)}</span>`);
  }

  // Toggle payment form
  $('input[name="pm"]').on('change', function(){
    $('#cardForm').toggle($(this).val()==='card');
  }).trigger('change');

  function validCard(){
    if($('input[name="pm"]:checked').val()!=='card') return true;
    const num = $('#ccNum').val().replace(/\s+/g,'');
    const exp = $('#ccExp').val();
    const cvc = $('#ccCvc').val();
    return /^[0-9]{16}$/.test(num) && /^[0-1][0-9]\/[0-9]{2}$/.test(exp) && /^[0-9]{3,4}$/.test(cvc);
  }

  $('#place').on('click', async function(){
    if(!helpers.isLogged()) return alert('Please sign in to place an order.');
    if(!cartIds.length) return alert('Cart is empty.');
    
    const city = $('#city').val().trim();
    const street = $('#street').val().trim();
    
    if(!city || !street) return alert('Fill city and street.');
    if(!validCard()) return alert('Check card fields.');

    const orderData = {
      items: cartIds.map(id => ({ book: id, quantity: 1, price: 0 })), 
      shippingDetails: { city, street, paymentMethod: $('input[name="pm"]:checked').val() },
      total: total
    };

    const res = await helpers.api('/orders', 'POST', orderData);

    if(res._id) {
      helpers.clearCart();
      alert('Order placed! Thank you.');
      location.href = 'index.html';
    } else {
      alert(res.msg || 'Error placing order');
    }
  });

  // Card Formatting
  $('#ccNum').on('input', function(){
    this.value=this.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  });
  $('#ccExp').on('input', function(){
    let v=this.value.replace(/\D/g,'').slice(0,4);
    if(v.length>=3) v=v.slice(0,2)+'/'+v.slice(2);
    this.value=v;
  });
});