<!DOCTYPE html>
<html>
<head>
  <title>Random Color Generator</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 50px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Random Color Generator</h1>
  <button onclick="changeColor()">Change Background Color</button>
  <script>
    function changeColor() {
      // Generate a random color in hexadecimal format.
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      
      // Update the background color of the page.
      document.body.style.backgroundColor = randomColor;
      
      // Alert the new color.
      alert("New background color: " + randomColor);
    }
  </script>
</body>
</html>
