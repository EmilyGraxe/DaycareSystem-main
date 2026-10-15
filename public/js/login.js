document.getElementById("login-form").addEventListener("submit", function (event) {

    //console.log(" Loginform submitted");
    event.preventDefault();
  
  
  
    const username = document.getElementById("username").value;
  
    const password = document.getElementById("password").value;
  
    const errorMessage = document.getElementById("error-message");
  
  
  
    // Replace these with actual credentials from the database
  
    const validUsername = "postgres";
  
    const validPassword = "HUSTLER";
  
  
  
    if (username === validUsername && password === validPassword) {
        //store session data(optional)
        localStorage.setItem("isLoggedIn", "true");
  
      // Redirect to the dashboard
  
      window.location.href = "/html/index.html";
  
    } else {
  
      // Show error message
  
     
      errorMessage.textContent = "Invalid username or password!";
      errorMessage.style.display = "block";
      //alert("Invalid username or password!");
    }
  
  });