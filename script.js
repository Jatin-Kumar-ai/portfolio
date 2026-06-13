document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  const header = document.querySelector('header');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      // Animate hamburger to X
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(6px, 6px)' : 'none';
      spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // Header background fade on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Active Link Highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     HERO TERMINAL TYPING EFFECT
     ========================================================================== */
  const terminalBody = document.querySelector('.terminal-body');
  if (terminalBody) {
    const linesData = [
      { type: 'input', text: 'jatin.info()' },
      { type: 'output', text: '=> Age: 14 | School Student | Location: India' },
      { type: 'input', text: 'jatin.skills' },
      { type: 'output', text: '=> ["Python", "Machine Learning", "Prompt Engineering", "HTML", "CSS"]' },
      { type: 'input', text: 'jatin.currentGoal' },
      { type: 'output', text: '=> "Leveraging data science to build predictive ML tools." 🚀' },
      { type: 'comment', text: '# Type help() or scroll down to explore projects!' }
    ];

    let currentLineIndex = 0;
    
    function appendTerminalLine(lineInfo, callback) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'terminal-line';

      if (lineInfo.type === 'input') {
        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = '>>>';
        lineDiv.appendChild(promptSpan);

        const typingSpan = document.createElement('span');
        typingSpan.className = 'typing';
        lineDiv.appendChild(typingSpan);
        terminalBody.appendChild(lineDiv);

        let charIndex = 0;
        const text = lineInfo.text;
        
        function typeChar() {
          if (charIndex < text.length) {
            typingSpan.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, 60);
          } else {
            typingSpan.classList.remove('typing');
            if (callback) callback();
          }
        }
        typeChar();
      } else {
        const outputSpan = document.createElement('span');
        if (lineInfo.type === 'comment') {
          outputSpan.className = 'terminal-comment';
        } else {
          outputSpan.className = 'terminal-output';
        }
        outputSpan.textContent = lineInfo.text;
        lineDiv.appendChild(outputSpan);
        terminalBody.appendChild(lineDiv);
        if (callback) callback();
      }
    }

    function playTerminalAnimation() {
      if (currentLineIndex < linesData.length) {
        appendTerminalLine(linesData[currentLineIndex], () => {
          currentLineIndex++;
          setTimeout(playTerminalAnimation, 400);
        });
      }
    }

    // Start typing after a brief initial delay
    setTimeout(playTerminalAnimation, 800);
  }

  /* ==========================================================================
     INTERACTIVE ML HOUSE PRICE PREDICTOR
     ========================================================================== */
  const areaSlider = document.getElementById('area');
  const bedroomsSlider = document.getElementById('bedrooms');
  const locationSlider = document.getElementById('location');
  
  const areaVal = document.getElementById('area-val');
  const bedroomsVal = document.getElementById('bedrooms-val');
  const locationVal = document.getElementById('location-val');
  
  const priceDisplay = document.getElementById('price-display');
  const chartDot = document.getElementById('chart-dot');

  // Locations label map
  const locationLabels = {
    1: 'Suburban Rim (Basic)',
    2: 'Residential Outer (Mid)',
    3: 'Urban Center (Standard)',
    4: 'Metro Hub (Premium)',
    5: 'Elite Sector (Luxury)'
  };

  // Linear Regression Model Weights (Tuned for realistic outputs)
  // Formula: Price = 45,000 + (Area * 125) + (Bedrooms * 18,000) + (Location * 35,000)
  const BASE_PRICE = 45000;
  const COEFF_AREA = 125;
  const COEFF_BEDROOMS = 18000;
  const COEFF_LOCATION = 35000;

  function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US');
  }

  function updatePrediction() {
    const area = parseInt(areaSlider.value);
    const bedrooms = parseInt(bedroomsSlider.value);
    const location = parseInt(locationSlider.value);

    // Update Slider Value Displays
    areaVal.textContent = area.toLocaleString() + ' sq ft';
    bedroomsVal.textContent = bedrooms;
    locationVal.textContent = locationLabels[location];

    // Predict
    const predictedPrice = BASE_PRICE + (area * COEFF_AREA) + (bedrooms * COEFF_BEDROOMS) + (location * COEFF_LOCATION);
    
    // Animate price update
    animateValue(priceDisplay, predictedPrice);

    // Update Regression Chart Point Indicator
    // Width mapping: Area is 500 to 5000. Let's map area percentage to X (10% to 90%)
    const minArea = 500;
    const maxArea = 5000;
    const xPct = ((area - minArea) / (maxArea - minArea)) * 100;
    
    // Height mapping: Price is $100k to $1M. Let's map price percentage to Y (10% to 90%)
    const minPrice = 100000;
    const maxPrice = 900000;
    const clampedPrice = Math.max(minPrice, Math.min(maxPrice, predictedPrice));
    const yPct = ((clampedPrice - minPrice) / (maxPrice - minPrice)) * 100;

    chartDot.style.left = `${xPct}%`;
    chartDot.style.bottom = `${yPct}%`;
  }

  // Helper function to animate number updates smoothly
  function animateValue(element, endVal) {
    const currentVal = parseInt(element.textContent.replace(/[$,]/g, '')) || 0;
    if (currentVal === endVal) return;
    
    const duration = 250; // ms
    const startTime = performance.now();
    
    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const val = Math.round(currentVal + (endVal - currentVal) * easeProgress);
      element.textContent = formatCurrency(val);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = formatCurrency(endVal);
      }
    }
    requestAnimationFrame(update);
  }

  if (areaSlider && bedroomsSlider && locationSlider) {
    areaSlider.addEventListener('input', updatePrediction);
    bedroomsSlider.addEventListener('input', updatePrediction);
    locationSlider.addEventListener('input', updatePrediction);
    // Initialize prediction
    updatePrediction();
  }

  /* ==========================================================================
     INTERACTIVE EMBEDDED CONSOLE GAMES
     ========================================================================== */
  
  // Game states and logic
  const gameNumberState = {
    active: false,
    low: 0,
    high: 0,
    num: 0,
    ch: 7,
    gc: 0,
    step: 'bounds' // 'bounds' | 'guess'
  };

  const gameWordState = {
    active: false,
    name: '',
    words: ['rainbow', 'computer', 'science', 'programming', 'python', 'mathematics', 'player', 'condition', 'reverse', 'water', 'board', 'geeks'],
    word: '',
    guesses: '',
    turns: 12,
    step: 'name' // 'name' | 'guess'
  };

  // Target DOM nodes for Number Guessing Game
  const btnRunNumber = document.getElementById('btn-run-number');
  const termNumberStatus = document.getElementById('term-number-status');
  const termNumberConsole = document.getElementById('term-number-console');
  const termNumberInput = document.getElementById('term-number-input');

  // Target DOM nodes for Word Guessing Game
  const btnRunWord = document.getElementById('btn-run-word');
  const termWordStatus = document.getElementById('term-word-status');
  const termWordConsole = document.getElementById('term-word-console');
  const termWordInput = document.getElementById('term-word-input');

  // Function to print text into game consoles
  function printToConsole(consoleElement, text, type = 'output') {
    const line = document.createElement('div');
    if (type === 'output') {
      line.className = 'terminal-output';
      line.textContent = text;
    } else if (type === 'input') {
      line.className = 'terminal-input-display';
      line.innerHTML = `<span style="color: var(--accent-cyan)">$ </span>${text}`;
    } else if (type === 'error') {
      line.className = 'terminal-error';
      line.innerHTML = `<span style="color: #ff5f56">[Error] </span>${text}`;
    }
    consoleElement.appendChild(line);
    consoleElement.scrollTop = consoleElement.scrollHeight;
  }

  // --- Number Guessing Game Core Controller ---
  if (btnRunNumber) {
    btnRunNumber.addEventListener('click', () => {
      if (gameNumberState.active) return; // Already running
      
      // Reset state
      gameNumberState.active = true;
      gameNumberState.gc = 0;
      gameNumberState.step = 'bounds';
      
      termNumberStatus.textContent = 'active';
      termNumberStatus.classList.add('running');
      termNumberConsole.innerHTML = ''; // Clear previous plays
      
      printToConsole(termNumberConsole, 'Hi! Welcome to the Number Guessing Game.');
      printToConsole(termNumberConsole, 'Enter the Lower Bound:');
      
      termNumberInput.value = '';
      termNumberInput.disabled = false;
      termNumberInput.focus();
    });

    termNumberInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = termNumberInput.value.trim();
        if (inputVal === '') return;

        printToConsole(termNumberConsole, inputVal, 'input');
        termNumberInput.value = '';

        handleNumberGameInput(inputVal);
      }
    });
  }

  function handleNumberGameInput(val) {
    if (gameNumberState.step === 'bounds') {
      // First bounds input: lower bound
      if (gameNumberState.low === 0 && gameNumberState.high === 0 && !gameNumberState.low_set) {
        const lower = parseInt(val);
        if (isNaN(lower)) {
          printToConsole(termNumberConsole, 'Please enter a valid integer for the Lower Bound:', 'error');
          return;
        }
        gameNumberState.low = lower;
        gameNumberState.low_set = true;
        printToConsole(termNumberConsole, 'Enter the Upper Bound:');
      } else {
        // Second bounds input: upper bound
        const upper = parseInt(val);
        if (isNaN(upper)) {
          printToConsole(termNumberConsole, 'Please enter a valid integer for the Upper Bound:', 'error');
          return;
        }
        if (upper <= gameNumberState.low) {
          printToConsole(termNumberConsole, `Upper Bound must be greater than Lower Bound (${gameNumberState.low}). Try again:`, 'error');
          return;
        }
        gameNumberState.high = upper;
        
        // Setup the secret number
        gameNumberState.num = Math.floor(Math.random() * (upper - gameNumberState.low + 1)) + gameNumberState.low;
        gameNumberState.ch = 7;
        gameNumberState.gc = 0;
        gameNumberState.step = 'guess';
        gameNumberState.low_set = false; // reset flag
        
        printToConsole(termNumberConsole, `\nYou have 7 chances to guess the number between ${gameNumberState.low} and ${gameNumberState.high}. Let's start!`);
        printToConsole(termNumberConsole, 'Enter your guess:');
      }
    } else if (gameNumberState.step === 'guess') {
      const guess = parseInt(val);
      if (isNaN(guess)) {
        printToConsole(termNumberConsole, 'Please enter a valid integer guess:', 'error');
        return;
      }

      gameNumberState.gc++;
      
      if (guess === gameNumberState.num) {
        printToConsole(termNumberConsole, `Correct! The number is ${gameNumberState.num}. You guessed it in ${gameNumberState.gc} attempts.`);
        endNumberGame();
      } else if (gameNumberState.gc >= gameNumberState.ch) {
        printToConsole(termNumberConsole, `Sorry! The number was ${gameNumberState.num}. Better luck next time.`);
        endNumberGame();
      } else {
        if (guess > gameNumberState.num) {
          printToConsole(termNumberConsole, 'Too high! Try a lower number.');
        } else {
          printToConsole(termNumberConsole, 'Too low! Try a higher number.');
        }
        printToConsole(termNumberConsole, `Enter your guess (Attempt ${gameNumberState.gc + 1}/7):`);
      }
    }
  }

  function endNumberGame() {
    gameNumberState.active = false;
    gameNumberState.low = 0;
    gameNumberState.high = 0;
    termNumberStatus.textContent = 'idle';
    termNumberStatus.classList.remove('running');
    termNumberInput.disabled = true;
  }


  // --- Word Guessing Game Core Controller ---
  if (btnRunWord) {
    btnRunWord.addEventListener('click', () => {
      if (gameWordState.active) return; // Already running

      gameWordState.active = true;
      gameWordState.step = 'name';
      gameWordState.guesses = '';
      gameWordState.turns = 12;
      
      // Select random word
      gameWordState.word = gameWordState.words[Math.floor(Math.random() * gameWordState.words.length)];
      
      termWordStatus.textContent = 'active';
      termWordStatus.classList.add('running');
      termWordConsole.innerHTML = '';
      
      printToConsole(termWordConsole, 'What is your name? ');
      
      termWordInput.value = '';
      termWordInput.disabled = false;
      termWordInput.focus();
    });

    termWordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputVal = termWordInput.value.trim();
        if (inputVal === '') return;

        printToConsole(termWordConsole, inputVal, 'input');
        termWordInput.value = '';

        handleWordGameInput(inputVal);
      }
    });
  }

  function renderWordPlaceholder() {
    let wordLine = '';
    let failed = 0;
    
    for (let char of gameWordState.word) {
      if (gameWordState.guesses.includes(char)) {
        wordLine += char + ' ';
      } else {
        wordLine += '_ ';
        failed++;
      }
    }
    
    printToConsole(termWordConsole, wordLine);
    return failed;
  }

  function handleWordGameInput(val) {
    if (gameWordState.step === 'name') {
      gameWordState.name = val;
      printToConsole(termWordConsole, `Good Luck ! ${gameWordState.name}`);
      printToConsole(termWordConsole, 'Guess the characters');
      
      renderWordPlaceholder();
      
      gameWordState.step = 'guess';
      printToConsole(termWordConsole, 'guess a character:');
    } else if (gameWordState.step === 'guess') {
      const char = val.toLowerCase().charAt(0);
      if (!char.match(/[a-z]/)) {
        printToConsole(termWordConsole, 'Please enter a valid character [a-z]:', 'error');
        return;
      }
      
      if (gameWordState.guesses.includes(char)) {
        printToConsole(termWordConsole, `You already guessed '${char}'. Try another character:`);
        return;
      }

      gameWordState.guesses += char;

      if (!gameWordState.word.includes(char)) {
        gameWordState.turns--;
        printToConsole(termWordConsole, 'Wrong');
        printToConsole(termWordConsole, `You have ${gameWordState.turns} more guesses`);
      }

      const failedCount = renderWordPlaceholder();

      if (failedCount === 0) {
        printToConsole(termWordConsole, 'You Win 🎉');
        printToConsole(termWordConsole, `The word is: ${gameWordState.word}`);
        endWordGame();
      } else if (gameWordState.turns <= 0) {
        printToConsole(termWordConsole, 'You Loose 😢');
        printToConsole(termWordConsole, `The correct word was: ${gameWordState.word}`);
        endWordGame();
      } else {
        printToConsole(termWordConsole, 'guess a character:');
      }
    }
  }

  function endWordGame() {
    gameWordState.active = false;
    termWordStatus.textContent = 'idle';
    termWordStatus.classList.remove('running');
    termWordInput.disabled = true;
  }

  /* ==========================================================================
     SKILL LEVEL ANIMATION ON SCROLL
     ========================================================================== */
  const skillBars = document.querySelectorAll('.skill-bar-inner');
  const skillsSection = document.getElementById('skills');

  function triggerSkillBars() {
    if (!skillsSection) return;
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight - 100;
    
    if (sectionPos < screenPos) {
      skillBars.forEach(bar => {
        const percent = bar.getAttribute('data-percent');
        bar.style.width = `${percent}%`;
      });
      // Remove listener once triggered
      window.removeEventListener('scroll', triggerSkillBars);
    }
  }

  window.addEventListener('scroll', triggerSkillBars);
  // Trigger once on load in case section is already in viewport
  setTimeout(triggerSkillBars, 500);

  /* ==========================================================================
     CONTACT FORM SUBMISSION SIMULATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const submitMsg = document.getElementById('submit-msg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      
      // Simulate API call
      setTimeout(() => {
        submitBtn.innerHTML = 'Sent!';
        submitMsg.style.display = 'block';
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          submitMsg.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  /* ==========================================================================
     RESUME POPUP MODAL
     ========================================================================== */
  const resumeModalOverlay  = document.getElementById('resume-modal-overlay');
  const resumeModalClose    = document.getElementById('resume-modal-close');
  const heroResumeBtn       = document.getElementById('hero-btn-resume');
  const resumeModalContainer = document.getElementById('resume-modal-container');

  // Focusable elements inside the modal (for focus trap)
  const getFocusable = () =>
    resumeModalContainer
      ? Array.from(resumeModalContainer.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ))
      : [];

  function openResumeModal() {
    if (!resumeModalOverlay) return;
    resumeModalOverlay.classList.add('is-open');
    resumeModalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // prevent background scroll

    // Focus the close button after animation (~380 ms)
    setTimeout(() => {
      if (resumeModalClose) resumeModalClose.focus();
    }, 400);
  }

  function closeResumeModal() {
    if (!resumeModalOverlay) return;
    resumeModalOverlay.classList.remove('is-open');
    resumeModalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Return focus to the trigger button
    if (heroResumeBtn) heroResumeBtn.focus();
  }

  // Open on button click
  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', openResumeModal);
  }

  // Close on X button click
  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', closeResumeModal);
  }

  // Close on overlay (backdrop) click — NOT on modal content click
  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener('click', (e) => {
      if (e.target === resumeModalOverlay) closeResumeModal();
    });
  }

  // Close on Escape key + focus trap
  document.addEventListener('keydown', (e) => {
    if (!resumeModalOverlay || !resumeModalOverlay.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeResumeModal();
      return;
    }

    // Focus trap: keep Tab/Shift+Tab inside the modal
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });
});

