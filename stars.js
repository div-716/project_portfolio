class StarTrail {
    constructor() {
        this.canvas = document.getElementById('starCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseMoving = false;
        this.lastMouseTime = 0;
        
        this.resize();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.isMouseMoving = true;
            this.lastMouseTime = Date.now();
            
            // Create new star at mouse position with some randomness
            if (Math.random() > 0.7) { // Only create stars 30% of the time for better performance
                this.createStar(
                    this.mouseX + (Math.random() - 0.5) * 20,
                    this.mouseY + (Math.random() - 0.5) * 20
                );
            }
        });
        
        document.addEventListener('mouseenter', () => {
            this.isMouseMoving = true;
        });
        
        document.addEventListener('mouseleave', () => {
            this.isMouseMoving = false;
        });
    }
    
    createStar(x, y) {
        const star = {
            x: x,
            y: y,
            size: Math.random() * 2 + 1,
            opacity: 1,
            decay: 0.015 + Math.random() * 0.015,
            color: this.getRandomColor(),
            vx: (Math.random() - 0.5) * 0.5, // Small random velocity
            vy: (Math.random() - 0.5) * 0.5,
            twinkle: Math.random() * Math.PI * 2, // For twinkling effect
            twinkleSpeed: 0.1 + Math.random() * 0.1
        };
        
        this.stars.push(star);
        
        // Limit the number of stars for performance
        if (this.stars.length > 40) {
            this.stars.shift();
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, ',     // Pure white
            'rgba(239, 216, 216, ',     // Light rose (#efd8d8)
            'rgba(204, 127, 127, ',     // Rose taupe (#cc7f7f)
            'rgba(255, 240, 245, ',     // Very light pink
            'rgba(248, 248, 255, '      // Ghost white
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateStars() {
        // Check if mouse has been idle for too long
        if (Date.now() - this.lastMouseTime > 100) {
            this.isMouseMoving = false;
        }
        
        this.stars.forEach((star, index) => {
            // Update position with small drift
            star.x += star.vx;
            star.y += star.vy;
            
            // Update opacity
            star.opacity -= star.decay;
            
            // Update twinkle
            star.twinkle += star.twinkleSpeed;
            
            // Remove faded stars
            if (star.opacity <= 0) {
                this.stars.splice(index, 1);
            }
        });
    }
    
    drawStars() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            this.ctx.save();
            
            // Calculate twinkling opacity
            const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinkle));
            
            // Create glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = star.color + twinkleOpacity + ')';
            
            // Draw the star
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color + twinkleOpacity + ')';
            this.ctx.fill();
            
            // Add extra glow for larger stars
            if (star.size > 1.5) {
                this.ctx.shadowBlur = 25;
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = star.color + (twinkleOpacity * 0.3) + ')';
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    animate() {
        this.updateStars();
        this.drawStars();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the star trail effect when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StarTrail();
});