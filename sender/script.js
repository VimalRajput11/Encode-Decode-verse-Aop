const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
let originalFileName = 'encrypted_image.png';


function textToBinary(text) {
  return text.split('')
             .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
             .join('');
}

document.getElementById('imageInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const imagePreview = document.getElementById('imagePreview');
    imagePreview.src = e.target.result;
    imagePreview.style.display = 'block'; 
  };
  reader.readAsDataURL(file);

  originalFileName = file.name.replace(/\.[^/.]+$/, '') + '_encrypted.png';

  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };
});


document.getElementById('hideData').addEventListener('click', () => {
  const text = document.getElementById('textToHide').value;
  if (!text) {
    alert('Please enter the text to hide!');
    return;
  }

  const binaryText = textToBinary(text) + '00000000'; 
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  
  if (binaryText.length > pixels.length / 4) {
    alert('Text is too long to hide in this image.');
    return;
  }

  
  for (let i = 0; i < binaryText.length; i++) {
    const bit = binaryText[i];
    const pixelIndex = i * 4; 

    if (bit === '1') {
      pixels[pixelIndex] |= 1;
    } else {
      pixels[pixelIndex] &= ~1; 
    }
  }


  ctx.putImageData(imageData, 0, 0);

  downloadBtn.style.display = 'inline-block';
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = originalFileName; 
    link.href = canvas.toDataURL(); 
    link.click(); 
  });
});
