function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        alert(data.message);
        // Redirect to home page
        window.location.href = "home.html";
      } else {
        alert(data.message || "Login failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred during login");
    });
}
