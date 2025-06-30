<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar tw-fixed tw-top-4 tw-w-full lg:tw-top-6" :class="{ 'scrolled': isScrolled }">
      <!-- <div class="tw-border-2 tw-mx-6 md:tw-mx-9 tw-relative tw-flex tw-flex-row tw-h-[var(--navbar-height)] tw-w-full tw-items-center tw-justify-between tw-rounded-lg tw-border tw-border-transparent tw-bg-brand-background tw-px-2 tw-py-1 tw-transition-[box-shadow_background-color_border-color] tw-duration-300 tw-motion-reduce:tw-transition-none lg:tw-grid lg:tw-grid-cols-[1fr_auto_1fr] lg:tw-rounded-2xl lg:tw-py-[0.4375rem] lg:tw-pr-[0.4375rem]"> -->
        <a href="#" class="logo">
          <div class="logo-icon">AC</div>
          <span>Agri</span><span>Connect</span>
        </a>
        <div class="nav-links" :class="{ 'mobile-menu': showMobileMenu }">
          <a href="#features" @click="showMobileMenu = false">Features</a>
          <a href="#benefits" @click="showMobileMenu = false">Benefits</a>
          <a href="#how-it-works" @click="showMobileMenu = false">How It Works</a>
          <a href="#testimonials" @click="showMobileMenu = false">Testimonials</a>
        </div>
        <a href="#" class="cta-button">Get Started</a>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">☰</button>
      <!-- </div> -->
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1><span>Farmers</span> & <span>Buyers</span> Connected Worldwide</h1>
        <p>Bridging the gap between agricultural producers and markets for local and global reach.</p>
        <div class="hero-buttons">
          <a href="#" class="cta-button">Join Now</a>
          <a href="#" class="secondary-button">Learn More</a>
        </div>
        <div v-if="false" class="stats">
          <div class="stat-item">
            <h3>10K+</h3>
            <p>Farmers Connected</p>
          </div>
          <div class="stat-item">
            <h3>5K+</h3>
            <p>Buyers Worldwide</p>
          </div>
          <div class="stat-item">
            <h3>85%</h3>
            <p>Reduced Waste</p>
          </div>
        </div>
      </div>
      <div id="earth-container">
        <div class="loading" id="loading" v-if="loading">Loading Earth</div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="section" id="features">
      <div class="section-title">
        <h2>Our Platform Features</h2>
        <p>Designed to empower both farmers and buyers with modern tools and global connections</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon farmer">
            <span>🌱</span>
          </div>
          <h3>For Farmers</h3>
          <ul>
            <li v-for="(feature, index) in farmerFeatures" :key="index">{{ feature }}</li>
          </ul>
        </div>
        <div class="feature-card">
          <div class="feature-icon buyer">
            <span>🛒</span>
          </div>
          <h3>For Buyers</h3>
          <ul>
            <li v-for="(feature, index) in buyerFeatures" :key="index">{{ feature }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="section benefits" id="benefits">
      <div class="section-title">
        <h2>Key Benefits</h2>
        <p>Why our platform is transforming agricultural commerce on a global scale</p>
      </div>
      <div class="benefits-grid">
        <div class="benefit-card" v-for="(benefit, index) in benefits" :key="index">
          <div class="benefit-icon" :style="benefit.iconStyle">
            <span>{{ benefit.icon }}</span>
          </div>
          <h3>{{ benefit.title }}</h3>
          <p>{{ benefit.description }}</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Ready to transform your agricultural business?</h2>
      <p>Join thousands of farmers and buyers already benefiting from our global platform</p>
      <a href="#" class="cta-button">Get Started Now</a>
    </section>

    <!-- Footer -->
    <footer>
      <div class="footer-grid">
        <div class="footer-about">
          <a href="#" class="footer-logo">
            <span>Agri</span><span>Connect</span>
          </a>
          <p>Connecting farmers and buyers worldwide for sustainable agricultural commerce and global trade opportunities.</p>
          <div class="social-links">
            <a v-for="(social, index) in socialLinks" :key="index" :href="social.link" class="social-link" target="_blank">
              {{ social.icon }}
            </a>
          </div>
        </div>
        <div class="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li v-for="(link, index) in quickLinks" :key="index">
              <a :href="link.href">{{ link.title }}</a>
            </li>
          </ul>
        </div>
        <div class="footer-links">
          <h3>Company</h3>
          <ul>
            <li v-for="(link, index) in companyLinks" :key="index">
              <a :href="link.href">{{ link.title }}</a>
            </li>
          </ul>
        </div>
        <div class="footer-newsletter">
          <h3>Newsletter</h3>
          <p>Subscribe to get updates on new features and global agricultural insights.</p>
          <input type="email" placeholder="Your Email" v-model="email">
          <a href="#" class="cta-button" style="display: block; width: 100%;">Subscribe</a>
        </div>
      </div>
      <div class="copyright">
        &copy; {{ currentYear }} AgriConnect. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: 'LandingPage',
  data() {
    return {
      isScrolled: false,
      showMobileMenu: false,
      loading: true,
      email: '',
      currentYear: new Date().getFullYear(),
      farmerFeatures: [
        'Global visibility for your farm location',
        'Sell produce directly to verified buyers worldwide',
        'Real-time global market price analytics',
        'Connect to international markets',
        'Advanced inventory management tools',
        'Multilingual sales dashboard',
      ],
      buyerFeatures: [
        'Find farmers globally on interactive map',
        'Post requests for specific produce worldwide',
        'View international farmer profiles and ratings',
        'Global bulk ordering capabilities',
        'Quality assurance tracking',
        'Currency conversion tools',
      ],
      benefits: [
        {
          title: 'Global Reach',
          description: 'Connect with buyers and sellers from around the world, expanding your market beyond local boundaries.',
          icon: '🌍',
          iconStyle: {
            background: 'rgba(76, 175, 80, 0.2)',
            color: '#4caf50',
          },
        },
        {
          title: 'Increased Profits',
          description: 'Eliminate middlemen to get better prices for farmers and better deals for international buyers.',
          icon: '💸',
          iconStyle: {
            background: 'rgba(255, 193, 7, 0.2)',
            color: '#ffc107',
          },
        },
        {
          title: 'Real-time Data',
          description: 'Comprehensive analytics help farmers optimize production and buyers plan global purchases.',
          icon: '📊',
          iconStyle: {
            background: 'rgba(33, 150, 243, 0.2)',
            color: '#2196f3',
          },
        },
        {
          title: 'Farm AI',
          description: 'AI analytics for crop growth predictions and livestock rearing optimized for global market demands.',
          icon: '🤖',
          iconStyle: {
            background: 'rgba(156, 39, 176, 0.2)',
            color: '#9c27b0',
          },
        },
      ],
      socialLinks: [
        { icon: 'f', link: '#' },
        { icon: 't', link: '#' },
        { icon: 'in', link: '#' },
        { icon: 'ig', link: '#' },
      ],
      quickLinks: [
        { title: 'Home', href: '#' },
        { title: 'Features', href: '#features' },
        { title: 'Benefits', href: '#benefits' },
        { title: 'How It Works', href: '#how-it-works' },
      ],
      companyLinks: [
        { title: 'About Us', href: '#' },
        { title: 'Contact', href: '#' },
        { title: 'Privacy Policy', href: '#' },
        { title: 'Terms of Service', href: '#' },
      ],
      scene: null,
      camera: null,
      renderer: null,
      earth: null,
      stars: null,
      mouseX: 0,
      mouseY: 0,
      targetRotationX: 0,
      targetRotationY: 0,
    };
  },
  mounted() {
    this.initThreeJS();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
    cancelAnimationFrame(this.animationFrameId);
  },
  methods: {
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
    initThreeJS() {
      // Create scene
      this.scene = new THREE.Scene();

      // Create camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        // eslint-disable-next-line sonarjs/no-duplicate-string
        document.getElementById('earth-container').clientWidth / document.getElementById('earth-container').clientHeight,
        0.1,
        1000,
      );
      this.camera.position.z = 3;

      // Create renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(
        document.getElementById('earth-container').clientWidth,
        document.getElementById('earth-container').clientHeight,
      );
      this.renderer.setClearColor(0x000000, 0);
      document.getElementById('earth-container').appendChild(this.renderer.domElement);

      // Create starfield
      this.createStarfield();

      // Create Earth
      this.createEarth();

      // Add lights
      this.addLights();

      // Add event listeners
      this.addEventListeners();

      // Hide loading
      this.loading = false;

      // Start animation
      this.animate();
    },
    createStarfield() {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = 2000;
      const positions = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200; // x
        positions[i + 1] = (Math.random() - 0.5) * 200; // y
        positions[i + 2] = (Math.random() - 0.5) * 200; // z
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1,
        transparent: true,
        opacity: 0.8,
      });

      this.stars = new THREE.Points(starGeometry, starMaterial);
      this.scene.add(this.stars);
    },
    createEarth() {
      const earthGroup = new THREE.Group();

      // Create transparent base sphere with wireframe option
      const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.2,
        shininess: 100,
      });
      const earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
      earthGroup.add(earthSphere);

      // Add wireframe outline to show the sphere clearly
      const wireframeGeometry = new THREE.SphereGeometry(1, 16, 16);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
      earthGroup.add(wireframe);

      // Create continent outlines using proper sphere coordinates
      this.createContinentLines(earthGroup);

      this.earth = earthGroup;
      this.scene.add(this.earth);
    },
    createContinentLines(earthGroup) {
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        linewidth: 2,
      });

      // North America outline
      const northAmericaPoints = [];
      const northAmericaCoords = [
        [-130, 70], [-100, 75], [-80, 70], [-70, 60], [-60, 45],
        [-70, 30], [-80, 25], [-100, 30], [-120, 40], [-140, 50], [-130, 70],
      ];

      northAmericaCoords.forEach((coord) => {
        const point = this.latLongToVector3(coord[1], coord[0], 1.005);
        northAmericaPoints.push(point);
      });

      const northAmericaGeometry = new THREE.BufferGeometry().setFromPoints(northAmericaPoints);
      const northAmericaLine = new THREE.Line(northAmericaGeometry, lineMaterial);
      earthGroup.add(northAmericaLine);

      // South America outline
      const southAmericaPoints = [];
      const southAmericaCoords = [
        [-80, 10], [-70, 5], [-60, -10], [-65, -30], [-70, -50],
        [-75, -55], [-80, -50], [-85, -30], [-90, -10], [-85, 5], [-80, 10],
      ];

      southAmericaCoords.forEach((coord) => {
        const point = this.latLongToVector3(coord[1], coord[0], 1.005);
        southAmericaPoints.push(point);
      });

      const southAmericaGeometry = new THREE.BufferGeometry().setFromPoints(southAmericaPoints);
      const southAmericaLine = new THREE.Line(southAmericaGeometry, lineMaterial);
      earthGroup.add(southAmericaLine);

      // Europe/Africa outline
      const europeAfricaPoints = [];
      const europeAfricaCoords = [
        [-10, 70], [20, 65], [40, 60], [30, 40], [20, 20],
        [15, 0], [10, -20], [20, -35], [15, -50], [10, -60],
        [0, -55], [-10, -30], [-5, 0], [0, 30], [-10, 50], [-10, 70],
      ];

      europeAfricaCoords.forEach((coord) => {
        const point = this.latLongToVector3(coord[1], coord[0], 1.005);
        europeAfricaPoints.push(point);
      });

      const europeAfricaGeometry = new THREE.BufferGeometry().setFromPoints(europeAfricaPoints);
      const europeAfricaLine = new THREE.Line(europeAfricaGeometry, lineMaterial);
      earthGroup.add(europeAfricaLine);

      // Asia outline
      const asiaPoints = [];
      const asiaCoords = [
        [60, 75], [120, 70], [140, 60], [130, 40], [120, 20],
        [100, 10], [80, 15], [70, 30], [60, 50], [60, 75],
      ];

      asiaCoords.forEach((coord) => {
        const point = this.latLongToVector3(coord[1], coord[0], 1.005);
        asiaPoints.push(point);
      });

      const asiaGeometry = new THREE.BufferGeometry().setFromPoints(asiaPoints);
      const asiaLine = new THREE.Line(asiaGeometry, lineMaterial);
      earthGroup.add(asiaLine);

      // Australia outline
      const australiaPoints = [];
      const australiaCoords = [
        [115, -10], [140, -12], [150, -25], [145, -40], [130, -35], [115, -20], [115, -10],
      ];

      australiaCoords.forEach((coord) => {
        const point = this.latLongToVector3(coord[1], coord[0], 1.005);
        australiaPoints.push(point);
      });

      const australiaGeometry = new THREE.BufferGeometry().setFromPoints(australiaPoints);
      const australiaLine = new THREE.Line(australiaGeometry, lineMaterial);
      earthGroup.add(australiaLine);
    },
    latLongToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
    },
    addLights() {
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
      this.scene.add(ambientLight);

      // Directional light (sun)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      this.scene.add(directionalLight);

      // Point light for rim lighting
      const pointLight = new THREE.PointLight(0xffffff, 0.5);
      pointLight.position.set(-5, -3, -5);
      this.scene.add(pointLight);
    },
    addEventListeners() {
      window.addEventListener('resize', this.onWindowResize);
      document.addEventListener('mousemove', this.onMouseMove);
    },
    onWindowResize() {
      this.camera.aspect = document.getElementById('earth-container').clientWidth / document.getElementById('earth-container').clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        document.getElementById('earth-container').clientWidth,
        document.getElementById('earth-container').clientHeight,
      );
    },
    onMouseMove(event) {
      this.mouseX = (event.clientX - window.innerWidth / 2) / 100;
      this.mouseY = (event.clientY - window.innerHeight / 2) / 100;
    },
    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);

      // Rotate Earth
      if (this.earth) {
        this.earth.rotation.y += 0.005;

        // Subtle mouse interaction
        this.targetRotationX = this.mouseY * 0.1;
        this.targetRotationY = this.mouseX * 0.1;

        this.earth.rotation.x += (this.targetRotationX - this.earth.rotation.x) * 0.02;
        this.earth.rotation.z += (this.targetRotationY - this.earth.rotation.z) * 0.02;
      }

      // Rotate starfield slowly
      if (this.stars) {
        this.stars.rotation.x += 0.0001;
        this.stars.rotation.y += 0.0002;
      }

      // Gentle camera movement
      this.camera.position.x = Math.sin(Date.now() * 0.0001) * 0.1;
      this.camera.position.y = Math.cos(Date.now() * 0.00015) * 0.1;

      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style scoped>
/* All the CSS from the previous HTML version goes here */
/* You can copy the exact same styles from the previous example */
/* I'm omitting them here to avoid duplication but they should be included */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  overflow-x: hidden;
  background: #000;
  color: white;
}

/* Navigation */
.navbar {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  transition: background 0.3s ease;
}

.navbar.scrolled {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.logo span:first-child {
  color: #2e7d32;
}

.logo span:last-child {
  color: #ff8f00;
}

.logo-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  background: linear-gradient(45deg, #2e7d32, #ff8f00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #ff8f00;
}

.cta-button {
  background: linear-gradient(45deg, #2e7d32, #4caf50);
  color: white;
  padding: 10px 25px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(46, 125, 50, 0.4);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.6);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

/* Hero Section */
.hero {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 5%;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 600px;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero h1 span:first-child {
  color: #2e7d32;
}

.hero h1 span:last-child {
  color: #ff8f00;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 25px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.stats {
  display: flex;
  gap: 30px;
}

.stat-item h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 5px;
}

.stat-item p {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 3D Earth Container */
#earth-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  z-index: 1;
}

/* Features Section */
.section {
  padding: 100px 5%;
  position: relative;
}

.section-title {
  text-align: center;
  margin-bottom: 60px;
}

.section-title h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
}

.section-title p {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  opacity: 0.8;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  transition: transform 0.3s ease, background 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.1);
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 24px;
}

.feature-icon.farmer {
  background: linear-gradient(45deg, #2e7d32, #4caf50);
}

.feature-icon.buyer {
  background: linear-gradient(45deg, #ff8f00, #ffb300);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.feature-card ul {
  list-style: none;
}

.feature-card li {
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
}

.feature-card li:before {
  content: "✓";
  color: #4caf50;
  margin-right: 10px;
  font-weight: bold;
}

/* Benefits Section */
.benefits {
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(46,125,50,0.1) 100%);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.benefit-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.benefit-card:hover {
  transform: translateY(-10px);
}

.benefit-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
}

.benefit-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 100px 5%;
  background: linear-gradient(135deg, rgba(46,125,50,0.2) 0%, rgba(255,143,0,0.2) 100%);
  border-radius: 20px;
  margin: 50px 5%;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.cta-section p {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto 40px;
  opacity: 0.9;
}

/* Footer */
footer {
  background: rgba(0, 0, 0, 0.8);
  padding: 80px 5% 30px;
  backdrop-filter: blur(10px);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
}

.footer-logo {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  margin-bottom: 20px;
}

.footer-logo span:first-child {
  color: #2e7d32;
}

.footer-logo span:last-child {
  color: #ff8f00;
}

.footer-about p {
  opacity: 0.7;
  margin-bottom: 20px;
  line-height: 1.6;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.social-link:hover {
  background: #4caf50;
}

.footer-links h3 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: white;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 1;
}

.footer-newsletter input {
  width: 100%;
  padding: 12px 15px;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  margin-bottom: 15px;
}

.footer-newsletter input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.copyright {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.7;
}

/* Loading Animation */
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  z-index: 200;
}

.loading:after {
  content: '...';
  animation: dots 1.5s steps(5, end) infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

/* Responsive Styles */
@media (max-width: 992px) {
  .hero h1 {
    font-size: 2.8rem;
  }

  #earth-container {
    width: 60%;
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .nav-links {
    position: fixed;
    top: 80px;
    right: -100%;
    width: 80%;
    height: calc(100vh - 80px);
    background: rgba(0, 0, 0, 0.9);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: right 0.3s ease;
    z-index: 999;
  }

  .nav-links.mobile-menu {
    right: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .hero {
    flex-direction: column;
    text-align: center;
    padding-top: 120px;
    height: auto;
    min-height: 100vh;
  }

  .hero-content {
    max-width: 100%;
    margin-bottom: 50px;
  }

  .hero-buttons {
    justify-content: center;
  }

  .stats {
    justify-content: center;
  }

  #earth-container {
    position: relative;
    width: 100%;
    height: 400px;
    margin-top: 50px;
    opacity: 1;
  }
}

@media (max-width: 576px) {
  .hero h1 {
    font-size: 2.2rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .stats {
    flex-direction: column;
    gap: 20px;
  }

  .section {
    padding: 70px 5%;
  }
}
</style>
