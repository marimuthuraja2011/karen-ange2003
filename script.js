document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === 'heart-intro.html') {
        initHeartPage();
    } else if (currentPage === 'puzzle.html') {
        initPuzzlePage();
    } else if (currentPage === 'questions.html') {
        initQuestionsPage();
    }
});

function initHeartPage() {
    const heart = document.getElementById('heart');
    const burstContainer = document.getElementById('burstContainer');
    
    if (heart) {
        heart.addEventListener('click', function() {
            createBurst();
            heart.style.animation = 'none';
            heart.style.transform = 'scale(1.3)';
            
            setTimeout(() => {
                window.location.href = 'puzzle.html';
            }, 1000);
        });
    }
    
    function createBurst() {
        const emojis = ['🌸', '🌺', '🌼', '🌻', '🎉', '✨', '💖', '💕', '🎊'];
        const heartRect = heart.getBoundingClientRect();
        const centerX = heartRect.left + heartRect.width / 2;
        const centerY = heartRect.top + heartRect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 150 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            burstContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
}

function initPuzzlePage() {
    const puzzleBoard = document.getElementById('puzzleBoard');
    const successMessage = document.getElementById('successMessage');
    
    const gridSize = 4;
    const totalPieces = gridSize * gridSize;
    let currentState = []; // Tracks which piece ID is at each position
    let selectedIndex = null;
    let imagePieces = []; // Store canvas elements for each piece
    
    function createPuzzle() {
        // Load the image first
        const img = new Image();
        img.onload = function() {
            // Use fixed size for puzzle pieces
            const targetSize = 100; // Each piece will be 100x100px
            const pieceWidth = img.width / gridSize;
            const pieceHeight = img.height / gridSize;
            
            for (let i = 0; i < totalPieces; i++) {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;
                
                const canvas = document.createElement('canvas');
                canvas.width = targetSize;
                canvas.height = targetSize;
                const ctx = canvas.getContext('2d');
                
                // Draw the cropped piece scaled to fit
                ctx.drawImage(
                    img,
                    col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight,
                    0, 0, targetSize, targetSize
                );
                
                imagePieces[i] = canvas;
            }
            
            // Create shuffled state array
            currentState = Array.from({length: totalPieces}, (_, i) => i);
            shuffleArray(currentState);
            
            // Render the puzzle
            renderPuzzle();
        };
        img.src = 'images/206b72fc-5ff1-4a32-a207-cc3a85762796.JPG';
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function renderPuzzle() {
        puzzleBoard.innerHTML = '';
        
        currentState.forEach((pieceId, position) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.pieceId = pieceId;
            piece.dataset.position = position;
            
            // Add the canvas image as background
            if (imagePieces[pieceId]) {
                const canvas = imagePieces[pieceId];
                piece.style.backgroundImage = `url(${canvas.toDataURL()})`;
                piece.style.backgroundSize = '100% 100%';
                piece.style.backgroundRepeat = 'no-repeat';
            }
            
            piece.addEventListener('click', () => selectPiece(position));
            puzzleBoard.appendChild(piece);
        });
    }
    
    function selectPiece(position) {
        const pieces = puzzleBoard.children;
        
        if (selectedIndex === null) {
            selectedIndex = position;
            pieces[position].classList.add('selected');
        } else {
            if (selectedIndex === position) {
                pieces[position].classList.remove('selected');
                selectedIndex = null;
            } else {
                // Swap in the state array
                [currentState[selectedIndex], currentState[position]] = [currentState[position], currentState[selectedIndex]];
                
                pieces[selectedIndex].classList.remove('selected');
                selectedIndex = null;
                
                // Re-render and check win
                renderPuzzle();
                setTimeout(checkWin, 300);
            }
        }
    }
    
    function checkWin() {
        // Check if currentState is [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        const isSolved = currentState.every((imageId, position) => imageId === position);
        
        if (isSolved) {
            puzzleBoard.style.pointerEvents = 'none';
            
            // Animate puzzle pieces
            const allPieces = puzzleBoard.children;
            Array.from(allPieces).forEach((piece, index) => {
                setTimeout(() => {
                    piece.style.transform = 'scale(1.05)';
                    piece.style.transition = 'transform 0.3s ease';
                }, index * 50);
            });
            
            // Show success modal after animation
            setTimeout(() => {
                showSuccessModal();
            }, 1000);
        }
    }
    
    function showSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'puzzle-success-modal';
        modal.innerHTML = `
            <div class="puzzle-success-content">
                <div class="puzzle-complete-image">
                    <img src="images/206b72fc-5ff1-4a32-a207-cc3a85762796.JPG" alt="Complete">
                </div>
                <h2>Amazing Girl! That's one beautiful picture of us</h2>
                <p>You solved the puzzle!</p>
                <button class="continue-btn" onclick="window.location.href='letter.html'">Continue, what your heart says.</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
    }
    
    createPuzzle();
}

function initQuestionsPage() {
}

// EmailJS Configuration
const PUBLIC_KEY = 'XZC5U4dnEj27of3yz'; // Replace with your EmailJS public key
const SERVICE_ID = 'service_p5ly2tr'; // Replace with your EmailJS service ID
const TEMPLATE_ID = 'template_6xt51pu'; // Replace with your EmailJS template ID

// Initialize EmailJS
(function() {
    emailjs.init(PUBLIC_KEY);
})();

function showResponse(answer) {
    const modal = document.getElementById('responseModal');
    const responseText = document.getElementById('responseText');
    
    // Capture interaction details
    const timestamp = new Date().toLocaleString();
    const device = navigator.platform;
    const agent = navigator.userAgent;
    const page = window.location.href;
    
    // Determine response type and button text
    const responseMap = {
        'yes': 'yes',
        'maybe': 'maybe', 
        'no': 'hurt'
    };
    
    const buttonTextMap = {
        'yes': 'Yes, idiot come to me ❤️',
        'maybe': 'Maybe 🤍',
        'no': 'My heart still hurts💔… but it still needs you'
    };
    
    const response = responseMap[answer];
    const buttonText = buttonTextMap[answer];
    
    console.log('Capturing Response:', {
        response: response,
        timestamp: timestamp,
        device: device,
        agent: agent,
        page: page,
        buttonText: buttonText
    });
    
    // Send email using EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        response: response,
        timestamp: timestamp,
        device: device,
        agent: agent,
        page: page,
        buttonText: buttonText
    })
    .then(function(responseEmail) {
        console.log('Email sent successfully!', responseEmail.status, responseEmail.text);
        console.log('SUCCESS: Response notification sent to your email');
    })
    .catch(function(error) {
        console.log('FAILED to send email...', error);
        console.log('ERROR: Could not send response notification');
    });
    
    // Display emotional popup response
    const emotionalResponses = {
        'yes': `You have no idea what this means to me.<br><br>
                I promise this time I will love you with more patience,<br>
                more care, and more gratitude than ever before.<br><br>
                Thank you for giving our love another heartbeat.<br>
                You didn't just accept me again…<br><br>
                You brought my heart back home.<br><br>
                I love you.`,
        'maybe': `That's okay.<br><br>
                I know healing takes time,<br>
                and I will respect every moment you need.<br><br>
                Just know this one thing —<br>
                my love for you isn't going anywhere.<br><br>
                I'll still be here,<br>
                hoping,<br>
                praying,<br>
                and waiting for the day your heart feels safe with me again.`,
        'no': `I know I hurt you, and that truth will always stay with me.<br>
                But hearing that your heart still remembers memeans more than you can imagine.<br>
                I won't rush you. I won't pressure you.<br>
                I will just keep loving you, becoming better,<br>
                and proving to you that our love deserves another chance.<br>
                Because even a broken heart<br>
                is still the most beautiful place<br>
                when it still holds love.`
    };
    
    responseText.innerHTML = emotionalResponses[answer];
    
    // Add heart animation based on response
    const heartType = answer === 'yes' ? '❤️' : answer === 'maybe' ? '🤍' : '💔';
    responseText.innerHTML = `<div class="modal-heart">${heartType}</div><br>${emotionalResponses[answer]}`;
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('responseModal');
    modal.classList.remove('show');
    
    // Redirect to future.html after fade animation
    setTimeout(() => {
        window.location.href = 'future.html';
    }, 600);
}

function checkDate(event) {
    event.preventDefault();
    
    const dateInput = document.getElementById('dateInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Parse the input date and format it as DD-MM-YY
    const inputDate = new Date(dateInput);
    const formattedDate = `${String(inputDate.getDate()).padStart(2, '0')}-${String(inputDate.getMonth() + 1).padStart(2, '0')}-${String(inputDate.getFullYear()).toString().slice(-2)}`;
    
    // Check if the date matches 01-07-03 (1 July 2003)
    if (formattedDate === '01-07-03') {
        // Correct date - redirect to heart intro page
        window.location.href = 'heart-intro.html';
    } else {
        // Wrong date - show error message
        errorMessage.textContent = 'That\'s not our special date... Try again 💔';
        errorMessage.classList.add('show');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
}
