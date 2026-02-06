helpers.bindHeaderSearch('globalSearch','globalQuery');

document.getElementById('authForm').addEventListener('submit', function(e){
  e.preventDefault();
  if(!this.checkValidity()){
    this.reportValidity();
    return;
  }
  const user={
    name:document.getElementById('name').value.trim(),
    email:document.getElementById('email').value.trim()
  };
  helpers.setUser(user);
  location.href='index.html';
});
