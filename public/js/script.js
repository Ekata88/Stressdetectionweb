// Smooth scrolling for navigation links that target sections on the same page
document.querySelectorAll('.nav-links a').forEach(anchor => {
  const href = anchor.getAttribute('href');

  // Only apply smooth scroll if the link is a hash (for in-page sections)
  if (href.startsWith('#')) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  }
});

