// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Progress bar animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 300);
            });
        }
    });
}, observerOptions);

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    progressObserver.observe(skillsSection);
}

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Method 1: Try FormSubmit (simple and reliable)
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('message', message);
            formData.append('_subject', 'New Portfolio Contact Message');
            formData.append('_captcha', 'false');
            formData.append('_template', 'table');
            
            const response = await fetch('https://formsubmit.co/sdivyanshi573@gmail.com', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showSuccessMessage();
                contactForm.reset();
                return;
            } else {
                throw new Error('FormSubmit failed');
            }
        } catch (error) {
            console.log('FormSubmit failed, trying alternative methods...', error);
        }
        
        // Method 2: Try EmailJS as backup
        try {
            await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'sdivyanshi573@gmail.com'
            });
            
            showSuccessMessage();
            contactForm.reset();
            return;
        } catch (error) {
            console.log('EmailJS failed, showing manual options...', error);
        }
        
        // Method 3: Show manual contact options
        showManualContactOptions(name, email, message);
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showSuccessMessage() {
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    const statusDiv = document.getElementById('form-status');
    if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
        statusDiv.innerHTML = '✅ Thank you! Your message has been sent successfully. I\'ll get back to you soon.';
    }
}

function showManualContactOptions(name, email, message) {
    showNotification('Let\'s connect directly! Use the options below to reach out.', 'info');
    
    const encodedMessage = encodeURIComponent(`Hi Divyanshi,\n\n${message}\n\nBest regards,\n${name}\n${email}`);
    
    const statusDiv = document.getElementById('form-status');
    if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = '#e7f3ff';
        statusDiv.style.color = '#004085';
        statusDiv.style.border = '1px solid #b3d7ff';
        statusDiv.innerHTML = `
            <p><strong>Let's connect directly! Choose your preferred method:</strong></p>
            <div style="margin-top: 15px; display: flex; flex-wrap: wrap; gap: 10px;">
                <a href="mailto:sdivyanshi573@gmail.com?subject=Portfolio Contact from ${name}&body=${encodedMessage}" 
                   class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 5px;">
                   📧 Send Email
                </a>
                <a href="https://www.linkedin.com/in/sdivyanshi573" target="_blank"
                   class="btn btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 5px; background: #0077b5;">
                   💼 LinkedIn Message
                </a>
                <button onclick="copyEmail()" class="btn btn-secondary" style="background: #6c757d; display: inline-flex; align-items: center; gap: 5px;">
                   📋 Copy Email
                </button>
            </div>
            <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                <strong>Your message:</strong> "${message}"
            </p>
        `;
    }
}

// Function to copy email to clipboard
function copyEmail() {
    const email = 'sdivyanshi573@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email address copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Email address copied to clipboard!', 'success');
    });
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Blog modal functionality
const blogPosts = {
    'python-journey': {
        title: 'Getting Started with Python: A Beginner\'s Journey',
        date: 'Dec 15, 2024',
        content: `
            <h3>Why I Chose Python</h3>
            <p>When I first decided to learn programming, I was overwhelmed by the number of languages available. After researching and talking to seniors, I chose Python as my first language, and it turned out to be one of the best decisions I made.</p>
            
            <h3>The Learning Process</h3>
            <p>Starting with basic syntax and gradually moving to more complex concepts like object-oriented programming, I found Python's readable syntax incredibly helpful. The extensive documentation and community support made learning enjoyable.</p>
            
            <h3>First Projects</h3>
            <p>My first project was a simple calculator, followed by a basic student management system. Each project taught me something new and built my confidence as a programmer.</p>
            
            <h3>Key Takeaways</h3>
            <p>Python opened doors to web development with Flask, data analysis, and even machine learning. The versatility of the language continues to amaze me as I explore new domains.</p>
            
            <h3>Advice for Beginners</h3>
            <p>Start with small projects, practice regularly, and don't be afraid to make mistakes. The Python community is incredibly supportive, and there are countless resources available online.</p>
        `
    },
    'balancing-studies': {
        title: 'Balancing Engineering Studies and Coding Projects',
        date: 'Nov 28, 2024',
        content: `
            <h3>The Challenge</h3>
            <p>As an engineering student, balancing academic coursework with personal coding projects can be challenging. However, I've found that both complement each other beautifully.</p>
            
            <h3>Time Management Strategies</h3>
            <p>I use time-blocking techniques to allocate specific hours for studies and coding. Weekend mornings are usually reserved for personal projects, while evenings are for academic work.</p>
            
            <h3>Finding Synergy</h3>
            <p>Many of my coding projects actually help reinforce concepts learned in class. For example, building a calculator app helped me understand mathematical algorithms better.</p>
            
            <h3>Staying Motivated</h3>
            <p>Setting small, achievable goals for both studies and projects keeps me motivated. Celebrating small wins, whether it's acing an exam or completing a feature, is important.</p>
            
            <h3>The Benefits</h3>
            <p>This balance has made me a more well-rounded student and developer. Academic knowledge provides the theoretical foundation, while coding projects offer practical application.</p>
        `
    },
    'first-web-project': {
        title: 'My First Web Development Project: Lessons Learned',
        date: 'Nov 10, 2024',
        content: `
            <h3>The Beginning</h3>
            <p>My first web development project was a simple portfolio website. I was excited but had no idea about the challenges that lay ahead.</p>
            
            <h3>Technology Choices</h3>
            <p>I started with basic HTML and CSS, then gradually incorporated JavaScript for interactivity. Later, I learned Flask for the backend to handle contact forms.</p>
            
            <h3>Challenges Faced</h3>
            <p>Responsive design was my biggest challenge. Making the website look good on all devices required learning CSS Grid and Flexbox thoroughly.</p>
            
            <h3>Problem-Solving Skills</h3>
            <p>Debugging CSS issues and JavaScript errors taught me patience and systematic problem-solving. Stack Overflow became my best friend during this journey.</p>
            
            <h3>The Result</h3>
            <p>After weeks of work, seeing my website live on the internet was incredibly rewarding. It gave me confidence to tackle more complex projects.</p>
            
            <h3>What I'd Do Differently</h3>
            <p>I would start with a mobile-first approach and plan the project structure better. Version control with Git would have saved me from many headaches.</p>
        `
    },
    'data-structures': {
        title: 'Understanding Data Structures: A Student\'s Perspective',
        date: 'Oct 25, 2024',
        content: `
            <h3>Why Data Structures Matter</h3>
            <p>Initially, data structures seemed like abstract concepts with little practical application. However, as I delved deeper into programming, I realized their fundamental importance.</p>
            
            <h3>Learning Approach</h3>
            <p>I found that implementing each data structure from scratch helped me understand their inner workings. Starting with arrays and linked lists, I gradually moved to more complex structures.</p>
            
            <h3>Practical Applications</h3>
            <p>Understanding stacks helped me grasp how function calls work. Learning about trees made database indexing concepts clearer. Each structure has its place and purpose.</p>
            
            <h3>Problem-Solving Skills</h3>
            <p>Data structures are tools for solving problems efficiently. Knowing when to use a hash table versus a binary search tree can make the difference between a slow and fast algorithm.</p>
            
            <h3>Study Tips</h3>
            <p>Visualizing data structures through drawings and animations helped me understand them better. Practice problems from coding platforms reinforced the concepts.</p>
            
            <h3>Real-World Impact</h3>
            <p>This knowledge has made me a better programmer. I can now choose the right data structure for each problem, leading to more efficient and elegant solutions.</p>
        `
    },
    'git-version-control': {
        title: 'Version Control with Git: Essential Skills for Students',
        date: 'Oct 12, 2024',
        content: `
            <h3>The Problem</h3>
            <p>Before learning Git, I used to create multiple folders like "project_v1", "project_v2", "project_final", "project_final_final". This was chaotic and inefficient.</p>
            
            <h3>Discovering Git</h3>
            <p>A senior recommended learning Git, and it completely transformed how I manage my projects. Version control became systematic and professional.</p>
            
            <h3>Key Benefits</h3>
            <p>Git allows me to track changes, collaborate with classmates, and never lose work. The ability to create branches for experimenting with new features is invaluable.</p>
            
            <h3>GitHub Integration</h3>
            <p>GitHub not only hosts my repositories but also serves as a portfolio. Potential employers can see my coding journey and project evolution.</p>
            
            <h3>Collaboration Made Easy</h3>
            <p>Working on group projects became much smoother with Git. Multiple people can work on the same project without conflicts, thanks to branching and merging.</p>
            
            <h3>Professional Preparation</h3>
            <p>Learning Git early has prepared me for professional software development. It's an essential skill that every developer needs to master.</p>
            
            <h3>Getting Started</h3>
            <p>Start with basic commands like add, commit, and push. Practice with personal projects before collaborating with others. The learning curve is worth it!</p>
        `
    }
};

function openBlogModal(postId) {
    const modal = document.getElementById('blogModal');
    const content = document.getElementById('blogModalContent');
    const post = blogPosts[postId];
    
    if (post) {
        content.innerHTML = `
            <h2 style="color: var(--primary-color); margin-bottom: 1rem; font-weight: 600;">${post.title}</h2>
            <p style="color: var(--gray-medium); margin-bottom: 2rem; font-style: italic;">${post.date}</p>
            <div style="line-height: 1.7; color: var(--darker-color);">
                ${post.content}
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('blogModal');
    if (e.target === modal) {
        closeBlogModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBlogModal();
    }
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
});

// Add smooth reveal animation for elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements for reveal animation
document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll('.project-card, .blog-card, .skill-category, .timeline-item');
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--white);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Loading...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--primary-color);
        font-size: 1.2rem;
        font-weight: 600;
        z-index: 10002;
    }
`;
document.head.appendChild(loadingStyle);