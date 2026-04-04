// Book functionality for memories page
let memoriesFlipbookInstance = null;

// Dynamic image detection function
async function getImageFilesFromFolder(folderPath) {
    try {
        // Since we can't directly access server files in static JS, 
        // we'll use a predefined list of common image extensions
        // and try to load them dynamically
        
        const commonImageNames = [
            '1.jpg', '2.jpg', '3.jpg', '6.jpg',
            '1000048415.JPG', '1000091483.JPG',
            '1a903d13-571e-4deb-8f10-55b4c5390156.JPG',
            '206b72fc-5ff1-4a32-a207-cc3a85762796.JPG',
            '3b31c56d-519f-4a0b-851a-7b914df62fbd.JPG',
            '3c850aca-9a07-488e-895e-05a754a5c43f.JPG',
            '3f9d43d2-acf5-40d4-98ae-3df623993777.JPG',
            '512a429d-8fb5-458b-8156-b280e1a82cf0.JPG',
            '758b067e-5ef2-46d6-851f-576b3c695548.JPG',
            '988857db-75ad-42a7-bc05-cb36a1866303.JPG',
            'IMG_0650.jpg', 'IMG_0717.JPG', 'IMG_0750.JPG',
            'IMG_3051.jpg', 'IMG_3233.jpg', 'IMG_3379.jpg',
            'IMG_3879.jpg', 'IMG_3938.jpg', 'IMG_4225.jpg',
            'IMG_4630.jpg', 'IMG_5332.jpg', 'IMG_5335.jpg',
            'IMG_5810.jpg', 'IMG_6601.JPG', 'IMG_6604.JPG',
            'IMG_6606.JPG', 'IMG_6607.JPG', 'IMG_6608.JPG',
            'IMG_6609.JPG', 'IMG_6610.JPG', 'IMG_6611.JPG',
            'IMG_6613.JPG', 'IMG_6614.JPG', 'IMG_6621.JPG',
            'IMG_6622.JPG', 'IMG_6624.JPG', 'IMG_6625.JPG',
            'IMG_6630.JPG', 'IMG_6631.JPG', 'IMG_6635.JPG',
            'IMG_6735.jpg', 'IMG_8349.jpg', 'IMG_8534.JPG',
            'IMG_9029.jpg', 'eebcf649-3073-4106-af8d-995528cb7261.JPG'
        ];
        
        const validImageFiles = [];
        
        // Test each potential image file
        for (const filename of commonImageNames) {
            const testImage = new Image();
            const isValid = await new Promise((resolve) => {
                testImage.onload = () => resolve(true);
                testImage.onerror = () => resolve(false);
                testImage.src = folderPath + filename;
            });
            
            if (isValid) {
                validImageFiles.push(filename);
                console.log(`Found image: ${filename}`);
            }
        }
        
        // Sort files alphabetically for consistent ordering
        validImageFiles.sort();
        
        console.log(`Dynamically detected ${validImageFiles.length} images in ${folderPath}`);
        return validImageFiles;
        
    } catch (error) {
        console.error('Error detecting image files:', error);
        // Fallback to basic list
        return ['1.jpg', 'IMG_3879.jpg', 'IMG_5332.jpg'];
    }
}

// Initialize memories page
async function initMemoriesPage() {
    await loadMemoriesPages();
    initializeStPageFlip();
}

// Load memory pages
async function loadMemoriesPages() {
    try {
        // Dynamic image detection - get all image files from assets/book/ folder
        const imageFiles = await getImageFilesFromFolder('assets/book/');
        
        const flipbookElement = document.getElementById('flipbook');
        
        console.log(`Loading ${imageFiles.length} memory pages...`);
        
        // Clear flipbook first
        flipbookElement.innerHTML = '';
        
        // Add cover page
        const coverPage = document.createElement('div');
        coverPage.className = 'hard';
        coverPage.innerHTML = `
            <h2>Our Memories</h2>
            <small>~ A Collection of Precious Moments ~</small>
        `;
        flipbookElement.appendChild(coverPage);
        
        // Create image pages dynamically
        imageFiles.forEach((filename, index) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            
            const img = document.createElement('img');
            img.src = `assets/book/${filename}`;
            img.alt = `Memory ${index + 1}`;
            
            img.onerror = function() {
                console.warn(`Image not found: assets/book/${filename}`);
                this.style.display = 'none';
                pageDiv.innerHTML = `
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%; font-family: 'Loved by the King', cursive; color: #636e72; text-align: center;">
                        <div>
                            <h3>Memory ${index + 1}</h3>
                            <p>A precious moment together</p>
                        </div>
                    </div>
                `;
            };
            
            // Add description
            const description = document.createElement('small');
            description.textContent = `Memory ${index + 1}`;
            
            pageDiv.appendChild(img);
            pageDiv.appendChild(description);
            flipbookElement.appendChild(pageDiv);
        });
        
        // Add back cover
        const backCoverPage = document.createElement('div');
        backCoverPage.className = 'hard';
        backCoverPage.innerHTML = `
            <h2>Thank You</h2>
            <small>~ Our Story Continues ~</small>
        `;
        flipbookElement.appendChild(backCoverPage);
        
        console.log(`Loaded ${imageFiles.length} memory pages for StPageFlip`);
        
    } catch (error) {
        console.error('Error loading memory pages:', error);
    }
}

// Initialize StPageFlip
function initializeStPageFlip() {
    const flipbookElement = document.getElementById('flipbook');
    
    // Debug: Check what's loaded
    console.log('jQuery loaded:', typeof jQuery !== 'undefined');
    console.log('jQuery version:', typeof jQuery !== 'undefined' ? jQuery.fn.jquery : 'N/A');
    console.log('Turn.js loaded:', typeof jQuery !== 'undefined' && typeof jQuery.fn.turn !== 'undefined');
    console.log('Available jQuery plugins:', typeof jQuery !== 'undefined' ? Object.keys(jQuery.fn) : 'jQuery not loaded');
    
    // Check for Turn.js library
    if (typeof jQuery !== 'undefined' && jQuery.fn.turn) {
        try {
            console.log('Initializing Turn.js...');
            
            // Initialize Turn.js
            memoriesFlipbookInstance = jQuery(flipbookElement);
            
            // Debug: Check page count and order
            const pageCount = flipbookElement.children.length;
            console.log('Page count detected:', pageCount);
            console.log('Pages found:', Array.from(flipbookElement.children).map((page, index) => {
                const content = page.querySelector('img') ? 
                    `IMG: ${page.querySelector('img').alt}` : 
                    page.querySelector('h2') ? 
                    `TITLE: ${page.querySelector('h2').textContent}` : 
                    'UNKNOWN';
                return `Page ${index + 1}: ${page.className} - ${content}`;
            }));
            
            memoriesFlipbookInstance.turn({
                width: 1000,
                height: 600,
                autoCenter: true,
                elevation: 50,
                gradients: true,
                duration: 600,
                pages: pageCount,
                display: 'single',
                when: {
                    start: function(e, page, view) {
                        console.log(`Start event - page: ${page}, view: ${view}`);
                    },
                    turning: function(e, page, view) {
                        console.log(`Turning to page ${page}`);
                        
                        // Switch to double page mode when leaving cover
                        if (page > 1) {
                            const currentDisplay = memoriesFlipbookInstance.turn('display');
                            if (currentDisplay === 'single') {
                                console.log('Leaving cover - switching to double page mode');
                                memoriesFlipbookInstance.turn('display', 'double');
                                setTimeout(() => {
                                    addPageCornerHandlers();
                                }, 200);
                            }
                        }
                        
                        updatePageIndicator(page);
                        updateButtonStates(page);
                    },
                    turned: function(e, page, view) {
                        console.log(`Turned to page ${page}`);
                        
                        // Switch to single page mode when returning to cover
                        if (page === 1) {
                            console.log('Returning to cover - switching to single page mode');
                            memoriesFlipbookInstance.turn('display', 'single');
                            setTimeout(() => {
                                addCoverClickHandler();
                            }, 100);
                        }
                        
                        // Show continue button on last page
                        const continueContainer = document.getElementById('continueContainer');
                        const totalPages = flipbookElement.children.length;
                        
                        if (page === totalPages - 1) {
                            continueContainer.style.display = 'block';
                            continueContainer.style.opacity = '1';
                        } else {
                            continueContainer.style.display = 'none';
                        }
                    },
                    end: function(e, page, view) {
                        console.log(`End event - page: ${page}, view: ${view}`);
                    }
                }
            });
            
            // Add fade-in animation
            setTimeout(() => {
                flipbookElement.style.opacity = '1';
                flipbookElement.style.transform = 'scale(1)';
            }, 100);
            
            // Add click handler for cover to open book
            setTimeout(() => {
                addCoverClickHandler();
            }, 500);
            
            console.log('Turn.js initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Turn.js:', error);
            fallbackToSimpleDisplay();
        }
    } else {
        console.error('Turn.js library not loaded, using fallback display');
        fallbackToSimpleDisplay();
    }
}

// Update page indicator
function updatePageIndicator(pageNumber) {
    // Create or update page indicator if it doesn't exist
    let pageIndicator = document.getElementById('turnPageIndicator');
    if (!pageIndicator) {
        pageIndicator = document.createElement('div');
        pageIndicator.id = 'turnPageIndicator';
        pageIndicator.style.cssText = `
            text-align: center;
            margin-top: 20px;
            font-family: 'Loved by the King', cursive;
            font-size: 1.2rem;
            color: #2d3436;
            background: rgba(0, 0, 0, 0.1);
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
        `;
        
        // Add to flipbook container
        const flipbookContainer = document.querySelector('.flipbook-container');
        if (flipbookContainer) {
            flipbookContainer.appendChild(pageIndicator);
        }
    }
    
    // Get actual page count from Turn.js or DOM
    let totalPages = 0;
    if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
        try {
            totalPages = memoriesFlipbookInstance.turn('pages');
        } catch (e) {
            totalPages = document.getElementById('flipbook').children.length;
        }
    } else {
        totalPages = document.getElementById('flipbook').children.length;
    }
    
    // Get current display mode
    let displayMode = 'single';
    if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
        try {
            displayMode = memoriesFlipbookInstance.turn('display');
        } catch (e) {
            displayMode = 'single';
        }
    }
    
    // Adjust page display for double page mode
    let displayText = `Page ${pageNumber} of ${totalPages}`;
    if (displayMode === 'double') {
        const view = memoriesFlipbookInstance.turn('view');
        if (view && view.length === 2) {
            displayText = `Pages ${view[0]}-${view[1]} of ${totalPages}`;
        }
    }
    
    console.log(`Updating page indicator: ${displayText} (mode: ${displayMode})`);
    pageIndicator.textContent = displayText;
}

// Update button states
function updateButtonStates(currentPage) {
    // Create navigation buttons if they don't exist
    let navContainer = document.getElementById('turnNavigation');
    if (!navContainer) {
        navContainer = document.createElement('div');
        navContainer.id = 'turnNavigation';
        navContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 30px;
            margin-top: 30px;
            padding: 20px;
        `;
        
        const prevBtn = document.createElement('button');
        prevBtn.id = 'turnPrevBtn';
        prevBtn.textContent = '← Previous';
        prevBtn.style.cssText = `
            padding: 15px 30px;
            background: linear-gradient(145deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            border-radius: 30px;
            font-family: 'Loved by the King', cursive;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(238, 90, 36, 0.3);
            font-weight: 600;
        `;
        
        const nextBtn = document.createElement('button');
        nextBtn.id = 'turnNextBtn';
        nextBtn.textContent = 'Next →';
        nextBtn.style.cssText = `
            padding: 15px 30px;
            background: linear-gradient(145deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            border-radius: 30px;
            font-family: 'Loved by the King', cursive;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(238, 90, 36, 0.3);
            font-weight: 600;
        `;
        
        // Add hover effects
        prevBtn.addEventListener('mouseenter', () => {
            prevBtn.style.transform = 'translateY(-2px)';
            prevBtn.style.boxShadow = '0 6px 20px rgba(238, 90, 36, 0.4)';
        });
        
        prevBtn.addEventListener('mouseleave', () => {
            prevBtn.style.transform = 'translateY(0)';
            prevBtn.style.boxShadow = '0 4px 15px rgba(238, 90, 36, 0.3)';
        });
        
        nextBtn.addEventListener('mouseenter', () => {
            nextBtn.style.transform = 'translateY(-2px)';
            nextBtn.style.boxShadow = '0 6px 20px rgba(238, 90, 36, 0.4)';
        });
        
        nextBtn.addEventListener('mouseleave', () => {
            nextBtn.style.transform = 'translateY(0)';
            nextBtn.style.boxShadow = '0 4px 15px rgba(238, 90, 36, 0.3)';
        });
        
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous button clicked');
            if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
                const currentPage = memoriesFlipbookInstance.turn('page');
                console.log('Current page before previous:', currentPage);
                if (currentPage > 1) {
                    memoriesFlipbookInstance.turn('previous');
                    console.log('Current page after previous:', memoriesFlipbookInstance.turn('page'));
                } else {
                    console.log('Already at page 1, cannot go previous');
                }
            }
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
                const currentPage = memoriesFlipbookInstance.turn('page');
                const totalPages = memoriesFlipbookInstance.turn('pages');
                
                // If on cover page, go to page 2 (first content page)
                if (currentPage === 1) {
                    memoriesFlipbookInstance.turn('display', 'double');
                    setTimeout(() => {
                        memoriesFlipbookInstance.turn('page', 2);
                        addPageCornerHandlers();
                    }, 200);
                }
                // Otherwise go to next page
                else if (currentPage < totalPages) {
                    memoriesFlipbookInstance.turn('next');
                }
            }
        });
        
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);
        
        // Add to memories content, not flipbook container
        const memoriesContent = document.querySelector('.memories-content');
        if (memoriesContent) {
            memoriesContent.appendChild(navContainer);
        }
    }
    
    // Update button states
    const prevBtn = document.getElementById('turnPrevBtn');
    const nextBtn = document.getElementById('turnNextBtn');
    const totalPages = document.getElementById('flipbook').children.length;
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
        prevBtn.style.opacity = currentPage <= 1 ? '0.5' : '1';
        prevBtn.style.cursor = currentPage <= 1 ? 'not-allowed' : 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.style.opacity = currentPage >= totalPages ? '0.5' : '1';
        nextBtn.style.cursor = currentPage >= totalPages ? 'not-allowed' : 'pointer';
    }
}

// Add cover click handler
function addCoverClickHandler() {
    const flipbookElement = document.getElementById('flipbook');
    let isBookOpen = false;
    
    // Add click event for cover and page navigation
    flipbookElement.addEventListener('click', function(e) {
        const currentPage = memoriesFlipbookInstance.turn('page');
        const totalPages = memoriesFlipbookInstance.turn('pages');
        
        console.log('Current page:', currentPage, 'Total pages:', totalPages);
        
        // If on cover page (page 1), open the book
        if (currentPage === 1) {
            console.log('Opening book - switching to double page mode');
            memoriesFlipbookInstance.turn('display', 'double');
            // Go to page 2 (first content page)
            setTimeout(() => {
                memoriesFlipbookInstance.turn('page', 2);
                isBookOpen = true;
                addPageCornerHandlers();
            }, 200);
        }
        // Otherwise handle normal page navigation
        else {
            const rect = flipbookElement.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            
            console.log('Flipbook clicked at position:', x, 'of width:', width);
            console.log('Current page before click:', memoriesFlipbookInstance.turn('page'));
            
            // If clicked on right half, go to next page
            if (x > width / 2) {
                console.log('Clicked right side - going to next page');
                if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
                    const totalPages = memoriesFlipbookInstance.turn('pages');
                    if (currentPage < totalPages) {
                        memoriesFlipbookInstance.turn('next');
                        console.log('Current page after next:', memoriesFlipbookInstance.turn('page'));
                    } else {
                        console.log('Already at last page, cannot go next');
                    }
                }
            }
            // If clicked on left half, go to previous page
            else {
                console.log('Clicked left side - going to previous page');
                if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
                    if (currentPage > 1) {
                        memoriesFlipbookInstance.turn('previous');
                        console.log('Current page after previous:', memoriesFlipbookInstance.turn('page'));
                    } else {
                        console.log('Already at page 1, cannot go previous');
                    }
                }
            }
        }
    });
    
    // Add hover effect to show clickable areas
    flipbookElement.style.cursor = 'pointer';
    
    console.log('Cover click handler added');
}

// Add page corner handlers
function addPageCornerHandlers() {
    const flipbookElement = document.getElementById('flipbook');
    
    // Remove all existing click handlers to avoid conflicts
    const newFlipbookElement = flipbookElement.cloneNode(true);
    flipbookElement.parentNode.replaceChild(newFlipbookElement, flipbookElement);
    
    // Add click event to the flipbook container for page navigation
    newFlipbookElement.addEventListener('click', function(e) {
        const rect = newFlipbookElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        
        console.log('Page corner handler - clicked at position:', x, 'of width:', width);
        
        const currentPage = memoriesFlipbookInstance.turn('page');
        console.log('Current page before click:', currentPage);
        
        // If clicked on right half, go to next page
        if (x > width / 2) {
            console.log('Clicked right side - going to next page');
            if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
                const totalPages = memoriesFlipbookInstance.turn('pages');
                if (currentPage < totalPages) {
                    memoriesFlipbookInstance.turn('next');
                    console.log('Current page after next:', memoriesFlipbookInstance.turn('page'));
                } else {
                    console.log('Already at last page, cannot go next');
                }
            }
        }
        // If clicked on left half, go to previous page
        else {
            console.log('Clicked left side - going to previous page');
            if (memoriesFlipbookInstance && typeof memoriesFlipbookInstance.turn === 'function') {
                if (currentPage > 1) {
                    memoriesFlipbookInstance.turn('previous');
                    console.log('Current page after previous:', memoriesFlipbookInstance.turn('page'));
                } else {
                    console.log('Already at page 1, cannot go previous');
                }
            }
        }
    });
    
    // Add hover effect to show clickable areas
    newFlipbookElement.style.cursor = 'pointer';
    
    console.log('Page corner handlers added with fresh element');
}

// Fallback to simple display
function fallbackToSimpleDisplay() {
    const flipbookElement = document.getElementById('flipbook');
    
    console.log('Using fallback display');
    
    // Create a simple CSS flipbook
    createSimpleFlipbook(flipbookElement);
}

// Create simple flipbook
function createSimpleFlipbook(container) {
    const pages = container.querySelectorAll('.page');
    if (pages.length === 0) return;
    
    // Simple flipbook CSS
    container.style.cssText = `
        position: relative;
        width: 1000px;
        height: 600px;
        margin: 0 auto;
        perspective: 1000px;
        transform-style: preserve-3d;
    `;
    
    // Style pages
    pages.forEach((page, index) => {
        page.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            backface-visibility: hidden;
            transform-origin: left center;
            transition: transform 0.6s ease-in-out;
            z-index: ${pages.length - index};
            display: ${index === 0 ? 'flex' : 'none'};
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;
    });
    
    // Add navigation
    const navDiv = document.createElement('div');
    navDiv.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    `;
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(145deg, #ff6b6b, #ee5a24);
        color: white;
        border: none;
        border-radius: 25px;
        font-family: 'Loved by the King', cursive;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(145deg, #ff6b6b, #ee5a24);
        color: white;
        border: none;
        border-radius: 25px;
        font-family: 'Loved by the King', cursive;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    const pageIndicator = document.createElement('span');
    pageIndicator.style.cssText = `
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 20px;
        font-family: 'Loved by the King', cursive;
        font-size: 1rem;
        color: #2d3436;
    `;
    
    let currentPageIndex = 0;
    
    function updateFlipbook() {
        pages.forEach((page, index) => {
            if (index === currentPageIndex) {
                page.style.display = 'flex';
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = pages.length;
            } else if (index < currentPageIndex) {
                page.style.display = 'flex';
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = 1;
            } else {
                page.style.display = 'none';
            }
        });
        
        pageIndicator.textContent = `Page ${currentPageIndex + 1} of ${pages.length}`;
        prevBtn.disabled = currentPageIndex <= 0;
        nextBtn.disabled = currentPageIndex >= pages.length - 1;
        
        // Show continue button on last page
        const continueContainer = document.getElementById('continueContainer');
        if (currentPageIndex === pages.length - 1) {
            continueContainer.style.display = 'block';
            continueContainer.style.opacity = '1';
        } else {
            continueContainer.style.display = 'none';
        }
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            updateFlipbook();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPageIndex < pages.length - 1) {
            currentPageIndex++;
            updateFlipbook();
        }
    });
    
    navDiv.appendChild(prevBtn);
    navDiv.appendChild(pageIndicator);
    navDiv.appendChild(nextBtn);
    
    container.parentNode.insertBefore(navDiv, container.nextSibling);
    
    // Initialize
    updateFlipbook();
    
    console.log('Simple flipbook created with', pages.length, 'pages');
}

// Export functions for use in main script
window.BookFlipbook = {
    initMemoriesPage,
    loadMemoriesPages,
    initializeStPageFlip,
    updatePageIndicator,
    updateButtonStates
};
