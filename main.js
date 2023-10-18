const canvas = document.getElementById("dendriticCanvas");
const ctx = canvas.getContext("2d");

// Form Inputs
const minBranchesInputValue = document.querySelector(".min-branches");
const maxBranchesInputValue = document.querySelector(".max-branches");
const minBranchLabel = document.querySelector(".minBranch-label");
const maxBranchLabel = document.querySelector(".maxBranch-label");
const branchBtn = document.querySelector(".new-branch__btn");

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function validateInput(minBranches, maxBranches) {
  const validationResult = {
    minBranchesValid: true,
    maxBranchesValid: true,
  };

  if (
    isNaN(minBranches) ||
    minBranches < 0 ||
    minBranches > 2 ||
    minBranches > maxBranches
  ) {
    validationResult.minBranchesValid = false;
  }

  if (isNaN(maxBranches) || maxBranches < 3 || maxBranches > 10) {
    validationResult.maxBranchesValid = false;
  }

  return validationResult;
}
function updateLabelStatus(validationResult) {
  if (
    !validationResult.minBranchesValid &&
    !validationResult.maxBranchesValid
  ) {
    // Both inputs are invalid
    minBranchLabel.classList.add("active");
    maxBranchLabel.classList.add("active");
  } else {
    // Check and set individually
    if (validationResult.minBranchesValid) {
      minBranchLabel.classList.remove("active");
    } else {
      minBranchLabel.classList.add("active");
    }

    if (validationResult.maxBranchesValid) {
      maxBranchLabel.classList.remove("active");
    } else {
      maxBranchLabel.classList.add("active");
    }
  }
}

function growDendrite(x, y, angle, n, minBranches, maxBranches) {
  if (n <= 0) return;

  const branchLength = 60;
  const newX = x + branchLength * Math.cos(angle);
  const newY = y + branchLength * Math.sin(angle);

  drawLine(x, y, newX, newY);

  const branchingProbability = 0.8;
  if (Math.random() < branchingProbability) {
    const numBranches = Math.floor(getRandom(minBranches, maxBranches + 1));

    for (let i = 0; i < numBranches; i++) {
      const newAngle = angle + getRandom(-Math.PI / 4, Math.PI / 4);
      growDendrite(newX, newY, newAngle, n - 1, minBranches, maxBranches);
    }
  }
}

branchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const minBranches = parseInt(minBranchesInputValue.value, 10);
  const maxBranches = parseInt(maxBranchesInputValue.value, 10);
  const validationResult = validateInput(minBranches, maxBranches);

  updateLabelStatus(validationResult);

  // If both are invalid, stop further processing
  if (
    !validationResult.minBranchesValid ||
    !validationResult.maxBranchesValid
  ) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  minBranchLabel.classList.remove("active");
  maxBranchLabel.classList.remove("active");
  // Start the dendritic growth from the center bottom of the canvas
  growDendrite(
    canvas.width / 2,
    canvas.height,
    -Math.PI / 2,
    10,
    minBranches,
    maxBranches
  );
});
