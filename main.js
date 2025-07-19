// FIXED modal functionality - waits for image to load before showing
function openModal(fullSizeSrc, caption) {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    
    // Hide modal initially
    modal.classList.remove('active');
    
    // Create a new image object to preload
    var tempImg = new Image();
    
    // Once the image loads, then show the modal
    tempImg.onload = function() {
        modalImg.src = fullSizeSrc;
        document.getElementById('caption').innerHTML = caption;
        modal.classList.add('active');
    };
    
    // Handle loading errors
    tempImg.onerror = function() {
        console.log('Error loading image:', fullSizeSrc);
        // Still show modal even if image fails to load
        modalImg.src = fullSizeSrc;
        document.getElementById('caption').innerHTML = caption;
        modal.classList.add('active');
    };
    
    // Start loading the image
    tempImg.src = fullSizeSrc;
}

// Close modal when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            // Close if clicking on the modal background (not the image)
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
        
        // Also close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }
});
