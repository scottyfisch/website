// IMPROVED modal with drag-to-pan functionality
let currentZoom = 1.0;
const zoomStep = 0.25;
const minZoom = 0.5;
const maxZoom = 3.0;

// Pan/drag state
let isPanning = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

function openModal(fullSizeSrc, caption) {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    
    // Reset zoom and pan
    currentZoom = 1.0;
    translateX = 0;
    translateY = 0;
    isPanning = false;
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Hide modal initially
    modal.classList.remove('active');
    
    // Create a new image object to preload
    var tempImg = new Image();
    
    // Once the image loads, then show the modal
    tempImg.onload = function() {
        modalImg.src = fullSizeSrc;
        document.getElementById('caption').innerHTML = caption;
        updateTransform();
        updateZoomDisplay();
        modal.classList.add('active');
    };
    
    // Handle loading errors
    tempImg.onerror = function() {
        console.log('Error loading image:', fullSizeSrc);
        modalImg.src = fullSizeSrc;
        document.getElementById('caption').innerHTML = caption;
        updateTransform();
        updateZoomDisplay();
        modal.classList.add('active');
    };
    
    // Start loading the image
    tempImg.src = fullSizeSrc;
}

function zoomIn() {
    if (currentZoom < maxZoom) {
        currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
        applyZoom();
    }
}

function zoomOut() {
    if (currentZoom > minZoom) {
        currentZoom = Math.max(currentZoom - zoomStep, minZoom);
        applyZoom();
    }
}

function resetZoom() {
    currentZoom = 1.0;
    translateX = 0;
    translateY = 0;
    applyZoom();
}

function applyZoom() {
    updateTransform();
    updateZoomDisplay();
    updateZoomButtons();
}

function updateTransform() {
    var modalImg = document.getElementById('modalImage');
    if (modalImg) {
        modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    }
}

function updateZoomDisplay() {
    var zoomDisplay = document.getElementById('zoomLevel');
    if (zoomDisplay) {
        zoomDisplay.textContent = Math.round(currentZoom * 100) + '%';
    }
}

function updateZoomButtons() {
    var zoomInBtn = document.getElementById('zoomInBtn');
    var zoomOutBtn = document.getElementById('zoomOutBtn');
    
    if (zoomInBtn) {
        zoomInBtn.disabled = currentZoom >= maxZoom;
    }
    if (zoomOutBtn) {
        zoomOutBtn.disabled = currentZoom <= minZoom;
    }
}

// Initialize modal controls when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    var container = document.querySelector('.modal-image-container');
    var closeBtn = document.getElementById('modalClose');
    
    // Close modal function
    function closeModal() {
        modal.classList.remove('active');
        resetZoom();
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
    
    if (modal) {
        // Close when clicking on modal background
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeModal();
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Drag to pan functionality
        if (container && modalImg) {
            modalImg.addEventListener('mousedown', function(e) {
                if (currentZoom > 1.0) {
                    isPanning = true;
                    startX = e.clientX - translateX;
                    startY = e.clientY - translateY;
                    container.classList.add('dragging');
                    e.preventDefault();
                }
            });
            
            document.addEventListener('mousemove', function(e) {
                if (isPanning) {
                    translateX = e.clientX - startX;
                    translateY = e.clientY - startY;
                    updateTransform();
                }
            });
            
            document.addEventListener('mouseup', function() {
                if (isPanning) {
                    isPanning = false;
                    container.classList.remove('dragging');
                }
            });
            
            // Prevent image dragging
            modalImg.addEventListener('dragstart', function(e) {
                e.preventDefault();
            });
        }
        
        // Mouse wheel zoom - ALWAYS when modal is active (no Ctrl needed)
        document.addEventListener('wheel', function(e) {
            // Only handle wheel events when modal is open
            if (modal.classList.contains('active')) {
                e.preventDefault(); // Prevent page scroll
                if (e.deltaY < 0) {
                    zoomIn();
                } else {
                    zoomOut();
                }
            }
        }, { passive: false });
    }
    
    // Setup zoom button listeners
    var zoomInBtn = document.getElementById('zoomInBtn');
    var zoomOutBtn = document.getElementById('zoomOutBtn');
    var resetBtn = document.getElementById('resetZoomBtn');
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            zoomIn();
        });
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            zoomOut();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            resetZoom();
        });
    }
});