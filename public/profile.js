helpers.bindHeaderSearch('globalSearch','globalQuery');

$(function(){
  const u = helpers.getUser();
  if(!u){
  $('#info').html('<div class="meta">You are not signed in. <a href="login.html" style="color:var(--brand)">Click here to Sign in</a>.</div>');
  return;
}
  // подсчёт отзывов
  const st = helpers.read();
  let cnt = 0; Object.values(st.reviews||{}).forEach(arr=>cnt+=arr.length);

  $('#info').html(`
    <div><strong>Name:</strong> ${u.firstName} ${u.lastName}</div>
    <div><strong>Email:</strong> ${u.email}</div>
    <div><strong>Age:</strong> ${u.age}</div>
    <div><strong>Gender:</strong> ${u.gender}</div>
    <div><strong>Reviews posted:</strong> ${cnt}</div>
  `);

  $('#logout').on('click', ()=>{ helpers.logout(); location.href='index.html'; });
});
