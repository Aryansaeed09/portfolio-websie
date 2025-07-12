document.addEventListener("DOMContentLoaded", () => {
  // Initialize counters
  const counters = document.querySelectorAll(".counter");
  const speed = 200;

  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.getAttribute("data-count");
      const count = +counter.innerText;
      const increment = Math.ceil(target / speed);

      if (count < target) {
        counter.innerText = count + increment;
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };

    // Start counting when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        updateCount();
        observer.unobserve(counter);
      }
    });

    observer.observe(counter);
  });

  // Animate skill bars when in view
  const skillBars = document.querySelectorAll(".skill-progress");
  skillBars.forEach((bar) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        bar.style.width = bar.style.width; // Trigger animation
        observer.unobserve(bar);
      }
    });
    observer.observe(bar);
  });

  // Contact button toggle
  const contactBtn = document.getElementById("contactBtn");
  const contactOptions = document.getElementById("contactOptions");

  contactBtn.addEventListener("click", function () {
    if (contactOptions.style.display === "flex") {
      contactOptions.style.display = "none";
    } else {
      contactOptions.style.display = "flex";
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });

      // Close mobile menu if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      }
    });
  });

  // Theme toggle logic
  const toggleBtn = document.getElementById("themeToggle");
  const icon = toggleBtn.querySelector("i");
  const body = document.body;
  const navbar = document.getElementById("mainNavbar");

  // Check for saved theme preference or use preferred color scheme
  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark");

  if (currentTheme === "light") {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    navbar.classList.add("light-mode");
    navbar.classList.remove("dark-mode");
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    body.classList.toggle("dark-mode");
    navbar.classList.toggle("light-mode");
    navbar.classList.toggle("dark-mode");

    // Toggle icon
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");

    // Save theme preference
    const theme = body.classList.contains("light-mode") ? "light" : "dark";
    localStorage.setItem("theme", theme);
  });

  // Navbar background change on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.style.background = body.classList.contains("light-mode")
        ? "rgba(255, 255, 255, 0.98)"
        : "rgba(20, 20, 40, 0.98)";
    } else {
      navbar.style.background = body.classList.contains("light-mode")
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(20, 20, 40, 0.9)";
    }
  });

  // Particle background
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 60;

  // Particle constructor
  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = body.classList.contains("light-mode")
      ? `rgba(110, 72, 170, ${Math.random() * 0.3 + 0.1})`
      : `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;

    this.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }

      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
    };

    this.draw = function () {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    };
  }

  // Initialize particles
  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connect();
    requestAnimationFrame(animate);
  }

  // Connect particles with lines
  function connect() {
    let opacity = 1;
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const distance = Math.sqrt(
          Math.pow(particles[a].x - particles[b].x, 2) +
            Math.pow(particles[a].y - particles[b].y, 2)
        );

        if (distance < 100) {
          opacity = 1 - distance / 100;
          ctx.strokeStyle = body.classList.contains("light-mode")
            ? `rgba(110, 72, 170, ${opacity * 0.2})`
            : `rgba(255, 255, 255, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Handle resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
  });

  // Start animation
  init();
  animate();

  // Scroll reveal animation
  const scrollReveal = ScrollReveal({
    origin: "bottom",
    distance: "60px",
    duration: 1000,
    delay: 100,
    reset: true,
  });

  scrollReveal.reveal(".card-3d, .section-title, .hero-subtitle, .btn-custom", {
    interval: 100,
  });
});
// Enhanced Carousel functionality for 6 clients
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".testimonial-carousel");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".prev-arrow");
  const nextBtn = document.querySelector(".next-arrow");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  const cardCount = cards.length;
  const cardWidth = cards[0].offsetWidth + 30; // Including gap

  // Initialize dots
  function initDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < Math.min(cardCount, 6); i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    carousel.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    updateDots();
  }

  // Update active dot
  function updateDots() {
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % cardCount;
    goToSlide(currentIndex);
  }

  // Previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + cardCount) % cardCount;
    goToSlide(currentIndex);
  }

  // Event listeners
  prevBtn.addEventListener("click", prevSlide);
  nextBtn.addEventListener("click", nextSlide);

  // Initialize
  initDots();

  // Auto-scroll (optional)
  // let autoScroll = setInterval(nextSlide, 5000);

  // Pause auto-scroll on hover
  carousel.addEventListener("mouseenter", () => clearInterval(autoScroll));
  carousel.addEventListener("mouseleave", () => {
    autoScroll = setInterval(nextSlide, 4000);
  });

  // Update on scroll
  carousel.addEventListener("scroll", function () {
    currentIndex = Math.round(this.scrollLeft / cardWidth);
    updateDots();
  });

  // Touch support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }
});
// Enhanced Project Filtering with Animation
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-chip");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      // Filter projects with animation
      projectItems.forEach((item) => {
        if (filterValue === "all" || item.classList.contains(filterValue)) {
          item.classList.remove("hide");
        } else {
          item.classList.add("hide");
        }
      });
    });
  });
});
