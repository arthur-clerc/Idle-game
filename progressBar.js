const levels = {
    iron: { min: 0, max: 20000, color: '#b9b9b9', increment: 300 },
    gold: { min: 20000, max: 120000, color: '#c4a82c', increment: 500 },
    diamond: { min: 120000, max: 340000, color: '#33b9b4', increment: 900 },
    nezerith: { min: 340000, max: 780000, color: '#4a234b', increment: 1700 },
  };
  
  const maxProgress = 780000; 
  
  
  let currentProgress = localStorage.getItem('progress') ? parseInt(localStorage.getItem('progress'), 10) : 0;
  
  
  function updateProgress() {
    
    const level = Object.values(levels).find(l => currentProgress >= l.min && currentProgress <= l.max);
    const addValue = level ? level.increment : 0;
  
    
    currentProgress = Math.min(currentProgress + addValue, maxProgress);
    
   
    localStorage.setItem('progress', currentProgress.toString());
    updateProgressBar();
    updateProgressColor();

    if (currentProgress >= maxProgress) {
        document.getElementById('win-message').style.display = 'block'; 
    }
}


  
  
  function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text'); 
    const progressPercentage = (currentProgress / maxProgress) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${currentProgress.toLocaleString()} / ${maxProgress.toLocaleString()}`; 
  }
  
  
  
  function updateProgressColor() {
    const progressBar = document.getElementById('progress-bar');
    const level = Object.values(levels).reverse().find(l => currentProgress >= l.min);
    const color = level ? level.color : levels.iron.color;
    progressBar.style.backgroundImage = `linear-gradient(to right, ${levels.iron.color}, ${color})`;
  }
  
  
  document.addEventListener('click', () => {
    if (currentProgress < maxProgress) {
      updateProgress();
    }
  });
  
  
  updateProgressBar();
  updateProgressColor();
  