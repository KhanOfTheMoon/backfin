helpers.bindHeaderSearch('globalSearch','globalQuery');

$(function(){
  // Автозаполнение почты из бд
  const KEY='qbook_users';
  const users = JSON.parse(localStorage.getItem(KEY) || '{}');

  $('#regForm').on('submit', function(e){
    e.preventDefault();
    const u = {
      firstName:$('#firstName').val().trim(),
      lastName: $('#lastName').val().trim(),
      email:    $('#email').val().trim().toLowerCase(),
      age:      +$('#age').val(),
      gender:   $('#gender').val(),
      password: $('#password').val()
    };
    if(users[u.email]) return $('#authMsg').text('User already exists.');
    users[u.email]=u;
    localStorage.setItem(KEY, JSON.stringify(users));
    helpers.setUser({firstName:u.firstName,lastName:u.lastName,email:u.email,age:u.age,gender:u.gender});
    $('#authMsg').text('Registered & signed in.');
    location.href='profile.html';
  });

  $('#loginForm').on('submit', function(e){
    e.preventDefault();
    const email=$('#lEmail').val().trim().toLowerCase();
    const pass =$('#lPassword').val();
    const u=users[email];
    if(!u || u.password!==pass) return $('#authMsg').text('Wrong email or password.');
    helpers.setUser({firstName:u.firstName,lastName:u.lastName,email:u.email,age:u.age,gender:u.gender});
    $('#authMsg').text('Signed in.'); location.href='profile.html';
  });
});