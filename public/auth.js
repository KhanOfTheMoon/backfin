$(function(){
  // REGISTER LOGIC 
  $('#regForm').on('submit', async function(e){
    e.preventDefault();
    
    // Validate inputs
    const p1 = $('#password').val();
    if(p1.length < 6) return $('#authMsg').text('Password must be at least 6 characters.');

    const data = {
      firstName: $('#firstName').val().trim(),
      lastName: $('#lastName').val().trim(),
      email: $('#email').val().trim().toLowerCase(),
      age: +$('#age').val(),
      gender: $('#gender').val(),
      role: $('input[name="role"]:checked').val(),
      password: p1
    };
    
    $('#authMsg').text('Creating account...').css('color', 'var(--muted)');
    
    const res = await helpers.api('/auth/register', 'POST', data);
    
    if(res.token) {
      localStorage.setItem('token', res.token);
      helpers.setUser(res.user);
      $('#authMsg').text('Success! Redirecting...').css('color', 'green');
      setTimeout(() => location.href='profile.html', 1000);
    } else {
      $('#authMsg').text(res.msg || 'Registration failed.').css('color', 'red');
    }
  });

  // LOGIN LOGIC 
  $('#loginForm').on('submit', async function(e){
    e.preventDefault();
    const data = {
      email: $('#lEmail').val().trim().toLowerCase(),
      password: $('#lPassword').val()
    };
    
    $('#authMsg').text('Signing in...').css('color', 'var(--muted)');

    const res = await helpers.api('/auth/login', 'POST', data);
    
    if(res.token) {
      localStorage.setItem('token', res.token);
      helpers.setUser(res.user);
      $('#authMsg').text('Success! Redirecting...').css('color', 'green');
      setTimeout(() => location.href='profile.html', 1000);
    } else {
      $('#authMsg').text(res.msg || 'Invalid email or password.').css('color', 'red');
    }
  });
});