const fileInput = document.getElementById('image-upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const removeBgBtn = document.getElementById('remove-bg');
const applyFilterBtn = document.getElementById('apply-filter');
const cropBtn = document.getElementById('crop');
const resetBtn = document.getElementById('reset');


let originalWidth = canvas.width;
let originalHeight = canvas.height;
let originalImage = null; 
let image = new Image(); 


fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      image.src = e.target.result;
      image.onload = () => {
       
        originalWidth = canvas.width;
        originalHeight = canvas.height;
        originalImage = image; 

       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    };
    reader.readAsDataURL(file);
  }
});


removeBgBtn.addEventListener('click', async () => {
  console.log('Remove Background triggered');
  const API_KEY = 'Sun89WbgD5PyKZJRmTKqRgDs'; 
  const canvasData = canvas.toDataURL('image/png').split(',')[1]; 

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY,
      },
      body: JSON.stringify({ image_file_b64: canvasData }),
    });

    const data = await response.blob(); 
    const url = URL.createObjectURL(data);
    const bgRemovedImage = new Image();
    bgRemovedImage.src = url;
    bgRemovedImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgRemovedImage, 0, 0, canvas.width, canvas.height);
    };
  } catch (error) {
    console.error('Error removing background:', error);
  }
});


applyFilterBtn.addEventListener('click', () => {
  console.log('Apply Filter triggered');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = data[i + 1] = data[i + 2] = avg; 
  }

  ctx.putImageData(imageData, 0, 0);
});


cropBtn.addEventListener('click', () => {
  console.log('Crop Image triggered');
  const croppedImage = ctx.getImageData(0, 0, canvas.width / 2, canvas.height / 2);
  canvas.width /= 2;
  canvas.height /= 2;
  ctx.putImageData(croppedImage, 0, 0);
});


resetBtn.addEventListener('click', () => {
  console.log('Reset triggered');
   canvas.width = originalWidth;
   canvas.height = originalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (image.src) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
});