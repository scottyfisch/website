

/////////// Menu /////////////////

document.addEventListener("DOMContentLoaded", function() {
    // Get all sections
    var sections = document.querySelectorAll('.hidden, [id$="-content"]');
    
    // Hide all sections
    sections.forEach(function(section) {
        section.classList.add('hidden');
    });

    // Show only the home content
    var homeContent = document.getElementById('home-content');
    homeContent.classList.remove('hidden', 'hidden-home');
});



function toggleVisibility(id) {
    var sections = document.querySelectorAll('.hidden, [id$="-content"]'); // Selects elements with class 'hidden' and elements with ids ending in '-content'
    var clickedSection = document.getElementById(id);
    
    // Determine if the clicked section is currently visible
    var isClickedSectionVisible = clickedSection.classList.contains('hidden');
    
    // Hide all sections
    sections.forEach(function(section) {
        section.classList.add('hidden');
    });

    var homeContent = document.getElementById('home-content');

    if (id === 'home-content') {
        if(isClickedSectionVisible) {
            // If home content was hidden, show it
            homeContent.classList.remove('hidden', 'hidden-home');
        } else {
            // If home content was visible, keep it visible
            homeContent.classList.remove('hidden', 'hidden-home');
        }
    } else {
        if (!isClickedSectionVisible) {
            // If the clicked section was already visible, just show the home section
            homeContent.classList.remove('hidden-home');
            homeContent.classList.remove('hidden'); // Just to be sure it's not hidden
        } else {
            // If the clicked section was not visible, display it
            clickedSection.classList.remove('hidden');
            // Ensure that home content is completely hidden
            homeContent.classList.add('hidden-home');
        }
    }
}


//////// Gallery /////////
// Preload images
const images = document.querySelectorAll('.hex-img image');

images.forEach(image => {

  const fullSize = new Image();
  fullSize.src = image.getAttribute('href').replace('_thumbnail','');

  fullSize.onload = () => {
    // Full size loaded 
  };

});

document.querySelectorAll('.hex-img').forEach(function(hex) {
    hex.addEventListener('click', function() {
        console.log("Image clicked");

        var modal = document.getElementById('imageModal');
        var modalImg = document.getElementById('modalImage');
        var imgElement = hex.querySelector('image');
        var caption = imgElement.getAttribute('data-caption');
        
        modal.classList.add('active'); // add the active class
        modalImg.src = imgElement.getAttribute('href').replace('_thumbnail', '');
                
        document.getElementById('caption').innerHTML = caption;
        
        modal.onclick = function() {
            modal.classList.remove('active');
        }
    });
});


//////// Hex and Text Spacing ///////

document.addEventListener("DOMContentLoaded", function() {
    // Query all the text elements within the SVG
    const textElements = document.querySelectorAll('svg .hex-skill-text');
    
    textElements.forEach((textElem, index) => {
        // Find the closest <g> parent
        const parentGroup = textElem.closest('g');

        // If the parent group is not found, log the problematic textElem and return
        if (!parentGroup) {
            console.error(`No parent <g> element found for text element at index: ${index}. Text Element:`, textElem);
            return;
        }

        // Find its <use> child
        const hexUseElem = parentGroup.querySelector('use');

        // Ensure the <use> element is found
        if (hexUseElem) {
            // Get the bounding box of the hex shape
            const hexBBox = hexUseElem.getBBox();

            // Get the bounding box of the text
            const textBBox = textElem.getBBox();

            // Calculate the centered x and y coordinates
            const centerX = hexBBox.x + (hexBBox.width / 2) - (textBBox.width / 2);
            const centerY = hexBBox.y + (hexBBox.height / 2) + (textBBox.height / 4); // The "+ (textBBox.height / 4)" part helps to visually vertically center the text

            // Apply the transform to center the text
            textElem.setAttribute('x', centerX);
            textElem.setAttribute('y', centerY);
            textElem.removeAttribute('transform'); // We remove the existing transform since we're now setting the x and y directly
        } else {
            // Log the error for debugging
            console.error(`No <use> element found for text element at index: ${index}. Parent group:`, parentGroup);
        }
    });
});



//////// Tooltip ///////////////////
function setDefaultSubject(tooltip, svg) {
    if (svg && svg.dataset.subject) {
        const subjectSpan = tooltip.querySelector('span[id$="Subject"]');
        subjectSpan.textContent = svg.dataset.subject;
    }
}

function showTooltip(event, tooltipType) {
    // Get hovered hexagon
    const hexagon = event.currentTarget;
  
    // Get SVG ancestor
    const svg = hexagon.closest('svg');
  
    // Get SVG data attribute 
    const subject = svg.dataset.subject;

    // Dynamically create the IDs based on tooltipType
    const tooltipID = `${tooltipType}-tooltip`;
    const tooltipSubjectID = `${tooltipType}-tooltipSubject`;
    const tooltipDetailsID = `${tooltipType}-tooltipDetails`;
    
    // Get the tooltip elements
    const tooltip = document.getElementById(tooltipID);
    const tooltipSubject = tooltip ? tooltip.querySelector(`#${tooltipSubjectID}`) : null;
    const tooltipDetails = tooltip ? tooltip.querySelector(`#${tooltipDetailsID}`) : null;

  
    // Ensure the tooltip elements exist
    if (tooltipSubject && tooltipDetails) {
      // Set tooltip subject text
      tooltipSubject.textContent = subject;
  
      // Append hexagon data
      const name = hexagon.dataset.name;
      const progress = hexagon.dataset.progress;
      tooltipDetails.textContent = ` > ${name} > ${progress}`;
    } else {
      console.error("Tooltip elements not found!");
    }
}

  

function hideTooltip(event) {
    const hexagon = event.currentTarget;
    const svg = hexagon.closest('svg');
    
    // Start with the previous sibling of the SVG
    let tooltip = svg.previousElementSibling;
    
    // Loop to find the previous div, ignoring any non-div elements
    while (tooltip && tooltip.tagName !== 'DIV') {
        tooltip = tooltip.previousElementSibling;
    }

    if (!tooltip) {
        console.error('Tooltip not found for:', svg);
        return;
    }

    const tooltipDetails = tooltip.querySelector('span[id$="Details"]');
    
    if (!tooltipDetails) {
        console.error('Tooltip details span not found inside:', tooltip);
        return;
    }

    tooltipDetails.textContent = '';
}



window.onload = function() {
    const artDesignSvg = document.querySelector('#art-skill svg');
    const artDesignTooltip = document.getElementById('artDesign-tooltip');
    const artDesignHexagons = artDesignSvg.querySelectorAll('.skill-main, .skill-proficient, .skill-competent, .skill-novice, .skill-aspiration');

    artDesignHexagons.forEach(hex => {
        hex.addEventListener('mouseover', function(event) {
          showTooltip(event, 'artDesign');
        });
        hex.addEventListener('mouseout', hideTooltip); 
    });
      

    setDefaultSubject(artDesignTooltip, artDesignSvg);

    const codingSvg = document.querySelector('#coding-skill svg');
    const codingTooltip = document.getElementById('coding-tooltip');
    const codingHexagons = codingSvg.querySelectorAll('.skill-main, .skill-proficient, .skill-competent, .skill-novice, .skill-aspiration');

    codingHexagons.forEach(hex => {
        hex.addEventListener('mouseover', function(event) {
          showTooltip(event, 'coding');
        });
        hex.addEventListener('mouseout', hideTooltip); 
    });
      

    setDefaultSubject(codingTooltip, codingSvg);

    const physicalSvg = document.querySelector('#physical-skill svg');
    const physicalTooltip = document.getElementById('physical-tooltip');
    const physicalHexagons = physicalSvg.querySelectorAll('.skill-main, .skill-proficient, .skill-competent, .skill-novice, .skill-aspiration');

    physicalHexagons.forEach(hex => {
        hex.addEventListener('mouseover', function(event) {
          showTooltip(event, 'physical');
        });
        hex.addEventListener('mouseout', hideTooltip); 
    });
      

    setDefaultSubject(physicalTooltip, physicalSvg);
};





