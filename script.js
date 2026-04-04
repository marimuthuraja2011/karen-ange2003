document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage === 'index.html' || currentPage === '' || currentPage === 'heart-intro.html') {
        initHeartPage();
    } else if (currentPage === 'puzzle.html') {
        initPuzzlePage();
    } else if (currentPage === 'questions.html') {
        initQuestionsPage();
    } else if (currentPage === 'future.html') {
        initFuturePage();
    } else if (currentPage === 'collage.html') {
        initCollagePage();
    } else if (currentPage === 'book.html') {
        initBookPage();
    } else if (currentPage === 'memories.html') {
        initMemoriesPage();
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

function initFuturePage() {
    // Try to play background music (may be blocked by browser)
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        // Set volume to a reasonable level
        backgroundMusic.volume = 0.3;
        
        // Try to play music (may require user interaction)
        backgroundMusic.play().catch(function(error) {
            console.log('Music autoplay blocked by browser. User interaction required.');
            
            // Add click listener to start music on first user interaction
            document.addEventListener('click', function startMusic() {
                backgroundMusic.play().catch(e => console.log('Music play failed:', e));
                document.removeEventListener('click', startMusic);
            }, { once: true });
        });
    }
}

function initCollagePage() {
    // Add interactive hover effects for collage items
    const collageItems = document.querySelectorAll('.collage-item');
    
    collageItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add a subtle pulse effect
            this.style.animation = 'pulse 2s infinite';
        });
        
        item.addEventListener('mouseleave', function() {
            // Remove pulse effect
            this.style.animation = '';
        });
        
        // Add click interaction to view larger version
        item.addEventListener('click', function() {
            const img = this.querySelector('.collage-img');
            if (img) {
                // Create a simple modal to view the image larger
                const modal = document.createElement('div');
                modal.className = 'collage-modal';
                modal.innerHTML = `
                    <div class="collage-modal-content">
                        <img src="${img.src}" alt="Enlarged view" class="modal-img">
                        <button class="modal-close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
                    </div>
                `;
                document.body.appendChild(modal);
                
                // Add fade in effect
                setTimeout(() => modal.classList.add('show'), 10);
            }
        });
    });
}

// Turn.js Book functionality
let flipbookInstance = null;
let bookPages = [];

async function initBookPage() {
    console.log('Initializing book page...');
    await loadBookPages();
    console.log('Book pages loaded:', bookPages.length);
    initializeTurnJS();
    setupTurnJSControls();
}

async function loadBookPages() {
    try {
        // List of images in the book folder
        const imageFiles = [
            '1.jpg',
            '2.jpg', 
            '3.jpg',
            '6.jpg',
            '1000048415.JPG',
            '1000091483.JPG',
            '1a903d13-571e-4deb-8f10-55b4c5390156.JPG',
            '206b72fc-5ff1-4a32-a207-cc3a85762796.JPG',
            '3b31c56d-519f-4a0b-851a-7b914df62fbd.JPG',
            '3c850aca-9a07-488e-895e-05a754a5c43f.JPG',
            '3f9d43d2-acf5-40d4-98ae-3df623993777.JPG',
            '512a429d-8fb5-458b-8156-b280e1a82cf0.JPG',
            '758b067e-5ef2-46d6-851f-576b3c695548.JPG',
            '988857db-75ad-42a7-bc05-cb36a1866303.JPG',
            'IMG_0650.jpg',
            'IMG_0717.JPG',
            'IMG_0750.JPG',
            'IMG_3051.jpg',
            'IMG_3233.jpg',
            'IMG_3379.jpg',
            'IMG_3879.jpg',
            'IMG_3938.jpg',
            'IMG_4225.jpg',
            'IMG_4630.jpg',
            'IMG_5332.jpg',
            'IMG_5335.jpg',
            'IMG_5810.jpg',
            'IMG_6601.JPG',
            'IMG_6604.JPG',
            'IMG_6606.JPG',
            'IMG_6607.JPG',
            'IMG_6608.JPG',
            'IMG_6609.JPG',
            'IMG_6610.JPG',
            'IMG_6611.JPG',
            'IMG_6613.JPG',
            'IMG_6614.JPG',
            'IMG_6621.JPG',
            'IMG_6622.JPG',
            'IMG_6624.JPG',
            'IMG_6625.JPG',
            'IMG_6630.JPG',
            'IMG_6631.JPG',
            'IMG_6635.JPG',
            'IMG_6735.jpg',
            'IMG_8349.jpg',
            'IMG_8534.JPG',
            'IMG_9029.jpg',
            'eebcf649-3073-4106-af8d-995528cb7261.JPG'
        ];
        
        // Create page HTML for Turn.js
        bookPages = imageFiles.map((filename, index) => {
            const description = getImageDescription(filename, index);
            return `
                <div class="page" style="position: relative; height: 100%; margin: 0; padding: 0; box-sizing: border-box; overflow: hidden;">
                    <img src="assets/book/${filename}" alt="Chapter ${index + 1}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; margin: 0; padding: 0;">
                    <div style="position: absolute; top: 0; ${index % 2 === 0 ? 'right: 0;' : 'left: 0;'} width: 40px; height: 100%; background: linear-gradient(${index % 2 === 0 ? 'to left' : 'to right'}, rgba(0,0,0,0.5), transparent); pointer-events: none;"></div>
                    <div style="position: absolute; bottom: 15px; ${index % 2 === 0 ? 'left: 15px;' : 'right: 15px;'} width: 30px; height: 30px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Crimson Text', serif; font-size: 12px; font-weight: bold; color: black; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 2}</div>
                </div>
            `;
        });
        
        // Add cover page
        const coverPage = `
            <div class="page hard" style="position: relative; margin: 0; padding: 0; box-sizing: border-box; overflow: hidden;">
                <img src="images/cover-1.jpeg" alt="Our Story Book Cover" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; margin: 0; padding: 0;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 30px; text-align: center; color: white;">
                    <h2 style="font-family: 'Loved by the King', cursive; font-size: 3rem; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">Our Story Book</h2>
                    <p style="font-family: 'Crimson Text', serif; font-style: italic; font-size: 1.5rem; opacity: 0.9; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">A Collection of Memories</p>
                </div>
            </div>
        `;
        
        // Add back cover
        const backCoverPage = `
            <div class="page hard" style="background: linear-gradient(135deg, #1e3c72, #2a5298); position: relative; margin: 0; padding: 0; box-sizing: border-box; overflow: hidden;">
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.4), transparent); padding: 30px; text-align: center; color: white;">
                    <h2 style="font-family: 'Loved by the King', cursive; font-size: 3rem; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">Thank You</h2>
                    <p style="font-family: 'Crimson Text', serif; font-style: italic; font-size: 1.5rem; opacity: 0.9; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">For being part of our story</p>
                    <div style="margin-top: 20px;">
                        <a href="questions.html" style="display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; font-family: 'Crimson Text', serif; font-style: italic; font-size: 1.2rem; border: 2px solid rgba(255,255,255,0.3); transition: all 0.3s ease;">Last but not the least... click me</a>
                    </div>
                </div>
            </div>
        `;
        
        bookPages.unshift(coverPage); // Add cover at the beginning
        bookPages.push(backCoverPage); // Add back cover at the end
        
        console.log(`Loaded ${bookPages.length} book pages for Turn.js`);
        console.log('First page preview:', bookPages[0]?.substring(0, 100));
        console.log('Book pages array:', bookPages);
        
    } catch (error) {
        console.error('Error loading book pages:', error);
    }
}

function getImageDescription(filename, index) {
    const descriptions = [
        'Where our journey began...',
        'Moments of pure joy...',
        'Laughter that filled our days...',
        'Together through every season...',
        'Building memories one day at a time...',
        'Every moment with you is precious...',
        'Our love story continues...',
        'Cherished times we\'ll never forget...',
        'The beauty of being together...',
        'Simple moments, extraordinary love...',
        'Creating our own fairy tale...',
        'Every day is an adventure...',
        'Growing stronger together...',
        'The best is yet to come...',
        'Forever starts with today...'
    ];
    
    return descriptions[index % descriptions.length];
}

function initializeTurnJS() {
    console.log('Initializing Turn.js...');
    const flipbookElement = document.getElementById('flipbook');
    
    console.log('Flipbook element found:', !!flipbookElement);
    console.log('jQuery loaded:', typeof jQuery !== 'undefined');
    console.log('Turn.js loaded:', typeof jQuery !== 'undefined' && jQuery.fn.turn);
    
    // Set the HTML content
    flipbookElement.innerHTML = bookPages.join('');
    console.log('Set flipbook HTML content');
    
    // Add basic styling to make flipbook visible
    flipbookElement.style.height = '600px';
    flipbookElement.style.margin = '0 auto';
    flipbookElement.style.display = 'block';
    flipbookElement.style.position = 'relative';
    flipbookElement.style.background = '#fff';
    flipbookElement.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
    flipbookElement.style.borderRadius = '10px';
    flipbookElement.style.overflow = 'hidden';
    // Remove width styling - let Turn.js manage the width
    console.log('Applied basic flipbook styling');
    
    // Initialize Turn.js
    if (typeof jQuery !== 'undefined' && jQuery.fn.turn) {
        console.log('Turn.js available, initializing...');
        flipbookInstance = jQuery('#flipbook');
        
        flipbookInstance.turn({
            width: 450, // Start with single page width for cover
            height: 600,
            autoCenter: true,
            elevation: 50,
            gradients: true,
            duration: 600,
            pages: bookPages.length,
            display: 'single', // Start with single page for cover
            when: {
                turning: function(e, page, view) {
                    console.log('Turning to page:', page, 'View:', view);
                    
                    // Switch to double page mode when leaving cover
                    if (page > 1) {
                        const currentDisplay = flipbookInstance.turn('display');
                        if (currentDisplay === 'single') {
                            console.log('Switching to double page mode');
                            flipbookInstance.turn('display', 'double');
                            flipbookInstance.turn('size', 900, 600); // Set double page size
                            flipbookInstance.turn('page', 2); // Go to first content spread
                        }
                    }
                    
                    updatePageIndicator(page);
                    updateButtonStates(page);
                },
                turned: function(e, page, view) {
                    console.log('Turned to page:', page, 'View:', view);
                    
                    // Switch to single page mode when returning to cover
                    if (page === 1) {
                        const currentDisplay = flipbookInstance.turn('display');
                        if (currentDisplay === 'double') {
                            console.log('Switching to single page mode for cover');
                            flipbookInstance.turn('display', 'single');
                            flipbookInstance.turn('size', 450, 600); // Set single page size (half width)
                        }
                    }
                    
                    updatePageIndicator(page);
                    updateButtonStates(page);
                }
            }
        });
        
        console.log('Turn.js initialized successfully');
        
    } else {
        console.error('Turn.js library not loaded, using fallback');
        // Fallback to simple book display
        initializeSimpleBook();
    }
}

function initializeSimpleBook() {
    const flipbookElement = document.getElementById('flipbook');
    
    // Create a simple book structure without external libraries
    let currentPage = 0;
    
    flipbookElement.style.display = 'flex';
    flipbookElement.style.width = '900px';
    flipbookElement.style.height = '600px';
    flipbookElement.style.margin = '0 auto';
    flipbookElement.style.position = 'relative';
    flipbookElement.style.background = 'linear-gradient(to right, #f8f6f0 0%, #fefdf8 50%, #f8f6f0 100%)';
    flipbookElement.style.borderRadius = '10px';
    flipbookElement.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
    flipbookElement.style.overflow = 'hidden';
    
    // Create page structure
    flipbookElement.innerHTML = `
        <div class="simple-book-pages" style="display: flex; width: 100%; height: 100%;">
            <div class="left-page" style="width: 50%; padding: 2rem; box-sizing: border-box; border-right: 2px solid #ddd;">
                ${bookPages[currentPage] || ''}
            </div>
            <div class="right-page" style="width: 50%; padding: 2rem; box-sizing: border-box;">
                ${bookPages[currentPage + 1] || ''}
            </div>
        </div>
    `;
    
    // Store reference for controls
    flipbookInstance = {
        currentPage: currentPage,
        totalPages: bookPages.length,
        turn: function(direction) {
            if (direction === 'next' && currentPage + 2 < bookPages.length) {
                currentPage += 2;
            } else if (direction === 'prev' && currentPage - 2 >= 0) {
                currentPage -= 2;
            }
            
            const leftPage = bookPages[currentPage] || '<div></div>';
            const rightPage = bookPages[currentPage + 1] || '<div></div>';
            
            flipbookElement.querySelector('.simple-book-pages').innerHTML = `
                <div class="left-page" style="width: 50%; padding: 2rem; box-sizing: border-box; border-right: 2px solid #ddd;">
                    ${leftPage}
                </div>
                <div class="right-page" style="width: 50%; padding: 2rem; box-sizing: border-box;">
                    ${rightPage}
                </div>
            `;
            
            updatePageIndicator(currentPage + 1);
            updateButtonStates(currentPage + 1);
        }
    };
    
    updatePageIndicator(1);
    updateButtonStates(1);
}

function setupTurnJSControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const flipbookElement = document.getElementById('flipbook');
    
    // Add page click functionality for Turn.js
    if (flipbookInstance && typeof flipbookInstance.turn === 'function') {
        // Turn.js has built-in click handling, but let's ensure it works
        flipbookElement.addEventListener('click', function(e) {
            const rect = flipbookElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            // Get current page and display mode
            const currentPage = flipbookInstance.turn('page');
            const totalPages = flipbookInstance.turn('pages');
            const display = flipbookInstance.turn('display');
            
            console.log('Page clicked - Current page:', currentPage, 'Display mode:', display, 'Click position:', x, 'Width:', width);
            
            // If clicked on right half, go to next page
            if (x > width / 2) {
                if (currentPage < totalPages) {
                    // Special handling for single page mode (cover)
                    if (display === 'single' && currentPage === 1) {
                        // From cover, switch to double mode and go to first spread
                        flipbookInstance.turn('display', 'double');
                        flipbookInstance.turn('size', 900, 600); // Use Turn.js size method
                        setTimeout(() => {
                            flipbookInstance.turn('page', 2);
                        }, 100);
                    } else {
                        flipbookInstance.turn('next');
                    }
                }
            }
            // If clicked on left half, go to previous page
            else {
                if (currentPage > 1) {
                    // Special handling for double-page mode
                    if (display === 'double') {
                        // If we're on the first content spread (pages 2-3), going back should take us to cover
                        if (currentPage === 2) {
                            flipbookInstance.turn('display', 'single');
                            flipbookInstance.turn('size', 450, 600); // Use Turn.js size method
                            setTimeout(() => {
                                flipbookInstance.turn('page', 1);
                            }, 100);
                        } else {
                            flipbookInstance.turn('previous');
                        }
                    } else {
                        // Single page mode - normal previous
                        flipbookInstance.turn('previous');
                    }
                }
            }
        });
        
        // Add cursor pointer to indicate clickable
        flipbookElement.style.cursor = 'pointer';
    }
    
    prevBtn.addEventListener('click', function() {
        if (flipbookInstance) {
            if (typeof flipbookInstance.turn === 'function') {
                // Turn.js - use same logic as page clicks
                const currentPage = flipbookInstance.turn('page');
                const display = flipbookInstance.turn('display');
                
                if (currentPage > 1) {
                    if (display === 'double') {
                        // If we're on the first content spread (pages 2-3), going back should take us to cover
                        if (currentPage === 2) {
                            flipbookInstance.turn('display', 'single');
                            flipbookInstance.turn('size', 450, 600); // Use Turn.js size method
                            setTimeout(() => {
                                flipbookInstance.turn('page', 1);
                            }, 100);
                        } else {
                            flipbookInstance.turn('previous');
                        }
                    } else {
                        // Single page mode - normal previous
                        flipbookInstance.turn('previous');
                    }
                }
            } else if (flipbookInstance.turn) {
                // Simple book
                flipbookInstance.turn('prev');
            }
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (flipbookInstance) {
            if (typeof flipbookInstance.turn === 'function') {
                // Turn.js - use same logic as page clicks
                const currentPage = flipbookInstance.turn('page');
                const display = flipbookInstance.turn('display');
                const totalPages = flipbookInstance.turn('pages');
                
                if (currentPage < totalPages) {
                    // Special handling for single page mode (cover)
                    if (display === 'single' && currentPage === 1) {
                        // From cover, switch to double mode and go to first spread
                        flipbookInstance.turn('display', 'double');
                        flipbookInstance.turn('size', 900, 600); // Use Turn.js size method
                        setTimeout(() => {
                            flipbookInstance.turn('page', 2);
                        }, 100);
                    } else {
                        flipbookInstance.turn('next');
                    }
                }
            } else if (flipbookInstance.turn) {
                // Simple book
                flipbookInstance.turn('next');
            }
        }
    });
}

function updatePageIndicator(pageNumber) {
    const pageIndicator = document.getElementById('pageIndicator');
    if (pageIndicator) {
        pageIndicator.textContent = `Page ${pageNumber}`;
    }
}

function updateButtonStates(currentPage) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
}

// EmailJS configuration - Global variables
let PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID;

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        PUBLIC_KEY = 'XZC5U4dnEj27of3yz'; // Replace with your EmailJS public key
        SERVICE_ID = 'service_p5ly2tr'; // Replace with your EmailJS service ID
        TEMPLATE_ID = 'template_6xt51pu'; // Replace with your EmailJS template ID

        // Initialize EmailJS
        emailjs.init(PUBLIC_KEY);
        console.log('EmailJS initialized successfully');
    } else {
        console.log('EmailJS not loaded');
    }
});

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
    
    // Send email using EmailJS (only if EmailJS is available)
    if (typeof emailjs !== 'undefined' && PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID) {
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
    } else {
        console.log('EmailJS not available or not properly configured');
    }
    
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
    
    // Add heart animation based on response
    const heartType = answer === 'yes' ? '❤️' : answer === 'maybe' ? '🤍' : '💔';
    responseText.innerHTML = `<div class="modal-heart">${heartType}</div><br>${emotionalResponses[answer]}`;
    
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('responseModal');
    modal.classList.remove('show');
    
    // Redirect to love message page after fade animation
    setTimeout(() => {
        window.location.href = 'love-message.html';
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
