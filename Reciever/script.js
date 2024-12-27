const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Function to convert binary to text
function binaryToText(binary) {
  return binary
    .match(/.{8}/g) // Match 8 bits at a time
    .map(byte => String.fromCharCode(parseInt(byte, 2))) // Convert each byte to a character
    .join(''); // Join the characters into a string
}

// Handle image upload
document.getElementById('imageInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    // Show the uploaded image
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.src = img.src;
    uploadedImage.style.display = 'block';

    // Draw the image on canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
});

// Extract hidden text
document.getElementById('extractData').addEventListener('click', () => {
  if (!canvas.width || !canvas.height) {
    document.getElementById('output').innerText = "Please upload an image first!";
    return;
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let binaryText = '';

  for (let i = 0; i < pixels.length; i += 4) {
    const lsb = pixels[i] & 1; // Get LSB of Red channel
    binaryText += lsb;

    // Check for end of message (when binaryText has a complete byte)
    if (binaryText.length % 8 === 0 && binaryText.endsWith('00000000')) {
      binaryText = binaryText.slice(0, -8); // Remove the null terminator
      break;
    }
  }

  const extractedText = binaryToText(binaryText);

  if (extractedText) {
    document.getElementById('output').innerText = `Extracted Text: ${extractedText}`;
  } else {
    // Show an alert if no hidden text is found
    alert("Sorry, there is no hidden text in this image.");
    document.getElementById('output').innerText = "Sorry, there is no hidden text.";

    // Optionally refresh the page after a short delay
    setTimeout(() => {
      location.reload();
    }, 2000); // Delay refresh by 2 seconds
  }
});
