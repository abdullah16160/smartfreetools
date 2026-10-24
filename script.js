
document.getElementById("year").textContent =
  new Date().getFullYear();

// WORD COUNTER
const textInput = document.getElementById("textInput");

function updateWordCount() {
  const text = textInput.value.trim();

  const words = text
    ? text.split(/\s+/u).filter(Boolean).length
    : 0;

  document.getElementById("wordCount").textContent = words;
  document.getElementById("charCount").textContent =
    textInput.value.length;
}

textInput.addEventListener("input", updateWordCount);

document.getElementById("clearText").addEventListener("click", () => {
  textInput.value = "";
  updateWordCount();
});

// PERCENTAGE CALCULATOR
document.getElementById("calculatePercentage")
  .addEventListener("click", () => {
    const partText = document.getElementById("part").value.trim();
    const wholeText = document.getElementById("whole").value.trim();
    const result = document.getElementById("percentageResult");

    if (partText === "" || wholeText === "") {
      result.textContent = "Please enter both numbers.";
      return;
    }

    const part = Number(partText);
    const whole = Number(wholeText);

    if (!Number.isFinite(part) || !Number.isFinite(whole)) {
      result.textContent = "Please enter valid numbers.";
      return;
    }

    if (whole === 0) {
      result.textContent = "Total value cannot be zero.";
      return;
    }

    result.textContent =
      `${part} is ${((part / whole) * 100).toFixed(2)}% of ${whole}.`;
  });

// IMAGE COMPRESSOR
const imageFile = document.getElementById("imageFile");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const imageResult = document.getElementById("imageResult");
const downloadImage = document.getElementById("downloadImage");
const compressButton = document.getElementById("compressButton");

let imageUrl = null;

quality.addEventListener("input", () => {
  qualityValue.textContent = quality.value + "%";
});

compressButton.addEventListener("click", () => {
  const file = imageFile.files[0];

  if (!file) {
    imageResult.textContent = "Please select an image first.";
    return;
  }

  if (!file.type.startsWith("image/")) {
    imageResult.textContent = "Please select a valid image.";
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    imageResult.textContent = "Please choose an image smaller than 20 MB.";
    return;
  }

  compressButton.disabled = true;
  compressButton.textContent = "Compressing...";

  const reader = new FileReader();

  reader.onerror = () => {
    imageResult.textContent = "Could not read this image.";
    resetButton();
  };

  reader.onload = () => {
    const img = new Image();

    img.onerror = () => {
      imageResult.textContent = "This image format is not supported.";
      resetButton();
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        if (!blob) {
          imageResult.textContent = "Compression failed. Try another image.";
          resetButton();
          return;
        }

        if (imageUrl) URL.revokeObjectURL(imageUrl);

        imageUrl = URL.createObjectURL(blob);
        downloadImage.href = imageUrl;
        downloadImage.classList.remove("hidden");

        const originalKB = (file.size / 1024).toFixed(1);
        const compressedKB = (blob.size / 1024).toFixed(1);
        const saved = Math.round((1 - blob.size / file.size) * 100);

        imageResult.textContent =
          `Original: ${originalKB} KB. Compressed: ${compressedKB} KB. ` +
          (saved >= 0
            ? `${saved}% smaller.`
            : `${Math.abs(saved)}% larger; try a lower quality setting.`);

        resetButton();
      }, "image/jpeg", Number(quality.value) / 100);
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

function resetButton() {
  compressButton.disabled = false;
  compressButton.textContent = "Compress Image";
}
