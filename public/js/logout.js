document.getElementById("logout-btn").addEventListener("click", function () {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (!confirmLogout) {
    return;
  } else {
      
  
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/html/login.html";}
});