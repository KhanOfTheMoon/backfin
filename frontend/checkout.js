helpers.bindHeaderSearch('globalSearch','globalQuery');

$(function(){
  // Если пришли с Buy now
  const buy = helpers.qs('buy');
  if(buy) helpers.addToCart(buy);

  const cart = helpers.getCart();
  const $items = $('#items'); let total=0;

  if(!cart.length){
    $items.html('<div class="meta">Cart is empty.</div>');
    $('#place').prop('disabled',true);
  }else{
    cart.forEach(id=>{
      const b = DB.find(x=>x.id===id); if(!b) return;
      total+=b.price;
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

  // переключение формы оплаты
  $('input[name="pm"]').on('change', function(){
    $('#cardForm').toggle($(this).val()==='card');
  }).trigger('change');

  // простая валидация карты
  function validCard(){
    if($('input[name="pm"]:checked').val()!=='card') return true;
    const num = $('#ccNum').val().replace(/\s+/g,'');
    const exp = $('#ccExp').val();
    const cvc = $('#ccCvc').val();
    return /^[0-9]{16}$/.test(num) && /^[0-1][0-9]\/[0-9]{2}$/.test(exp) && /^[0-9]{3,4}$/.test(cvc);
  }

  $('#place').on('click', function(){
    const city=$('#city').val().trim(), street=$('#street').val().trim();
    if(!cart.length) return alert('Cart is empty.');
    if(!city || !street) return alert('Fill city and street.');
    if(!validCard()) return alert('Check card fields (number, MM/YY, CVC).');

    helpers.clearCart();
    alert('Order placed! Thank you.');
    location.href='index.html';
  });

  // auto-format номера карты (XXXX XXXX XXXX XXXX)
  $('#ccNum').on('input', function(){
    this.value=this.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  });
  // авто-формат MM/YY
  $('#ccExp').on('input', function(){
    let v=this.value.replace(/\D/g,'').slice(0,4);
    if(v.length>=3) v=v.slice(0,2)+'/'+v.slice(2);
    this.value=v;
  });
});
