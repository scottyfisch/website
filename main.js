
// Updated modal functionality
function openModal(fullSizeSrc, caption) {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    
    modalImg.src = fullSizeSrc;
    document.getElementById('caption').innerHTML = caption;
    modal.classList.add('active');
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





