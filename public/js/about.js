// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    // Animate the header
    const header = document.querySelector('header');
    if (header) {
        header.style.opacity = '0';
        header.style.transition = 'opacity 1s ease-in-out';
        setTimeout(() => {
            header.style.opacity = '1';
        }, 500);
    }

    // Animate the developer profile cards
    const teamMembers = document.querySelectorAll('.developer-profile');
    teamMembers.forEach((member, index) => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(50px)';
        member.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        setTimeout(() => {
            member.style.opacity = '1';
            member.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });

    // Add hover effect to developer profile cards
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            member.style.transform = 'scale(1.05)';
            member.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });
        member.addEventListener('mouseleave', () => {
            member.style.transform = 'scale(1)';
            member.style.boxShadow = 'none';
        });
    });

    // Smooth scroll for internal navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
