/**
 * Main UI Script
 * Handles block toggling (abstract/bibtex), lightbox modal, and theme switching.
 */

// Toggle visibility of abstract and bibtex sections
function toggleBlock(id) {
  var element = document.getElementById(id);
  if (!element) return;
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

// Open modal preview with image source and alt text
function openImageModal(src, alt) {
  var modal = document.getElementById('image-modal');
  var img = document.getElementById('modal-img-target');
  if (modal && img) {
    img.onerror = function() {
      if (!this.src.includes('/tn/')) {
        this.src = '/tn' + src;
      }
    };
    img.src = src;
    img.alt = alt || 'Preview';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Open profile photo modal
function openProfileModal() {
  openImageModal('images/profile.jpg', 'Giacomo Vianello');
}

// Close image lightbox modal
function closeImageModal(e) {
  if (!e || e.target.id === 'image-modal' || e.target.closest('.modal-close')) {
    var modal = document.getElementById('image-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
}

// Alias to close profile modal
function closeProfileModal(e) {
  closeImageModal(e);
}

// Close modal on Escape key press
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

// Toggle between light and dark theme
function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Sync with system theme changes if user hasn't explicitly set a preference
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
    }
  });
}

