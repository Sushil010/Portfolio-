



// const { OrbitControls } = require("three/examples/jsm/Addons.js")

// Loader functionality
function initLoader() {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main');
    
    if (!loader || !mainContent) return;
    
    // Prevent body scroll while loading
    document.body.classList.add('loading');
    
    // Function to hide loader and show content
    function hideLoader() {
        loader.classList.add('hidden');
        mainContent.classList.add('loaded');
        document.body.classList.remove('loading');
        
        // Remove loader from DOM after animation completes
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 600);
    }
    
    // Track loaded resources
    let resourcesLoaded = 0;
    let totalResources = 0;
    const images = document.querySelectorAll('img');
    const externalScripts = Array.from(document.querySelectorAll('script[src]')).filter(
        script => script.src && !script.src.includes('data:')
    );
    
    // Count total resources
    totalResources = images.length + externalScripts.length;
    
    // If no resources, hide loader after a short delay
    if (totalResources === 0) {
        setTimeout(hideLoader, 800);
        return;
    }
    
    // Check if images are already loaded
    let imagesLoadedCount = 0;
    images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
            imagesLoadedCount++;
        } else {
            img.addEventListener('load', () => {
                imagesLoadedCount++;
                checkAllLoaded();
            });
            img.addEventListener('error', () => {
                imagesLoadedCount++;
                checkAllLoaded();
            });
        }
    });
    
    // Check if scripts are loaded (most are loaded by now)
    let scriptsLoadedCount = 0;
    externalScripts.forEach((script) => {
        // Scripts are typically loaded synchronously, so count them as loaded
        scriptsLoadedCount++;
    });
    
    function checkAllLoaded() {
        if (imagesLoadedCount === images.length && scriptsLoadedCount === externalScripts.length) {
            // Small delay for smooth transition
            setTimeout(hideLoader, 400);
        }
    }
    
    // If all images are already loaded
    if (imagesLoadedCount === images.length) {
        setTimeout(hideLoader, 600);
    }
    
    // Fallback: hide loader after maximum wait time (5 seconds)
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            hideLoader();
        }
    }, 5000);
    
    // Also listen to window load event as backup
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!loader.classList.contains('hidden')) {
                hideLoader();
            }
        }, 500);
    });
}

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
} else {
    initLoader();
}

var main=document.querySelector("#main")
var cursor=document.querySelector("#cursor")
var a=document.querySelectorAll(".sm-text")
var big=document.querySelectorAll(".big-text")
var lines=document.querySelectorAll(".lines")
var text=document.querySelectorAll("#text")
// var c1=document.querySelector(".c1")
// const images = document.querySelectorAll(".c1 .img");
// (0,0)-------------->x++
//                    |   
//                    |
//                    .y++

let locoScroll;

function initLocomotiveScroll() {
    gsap.registerPlugin(ScrollTrigger);

    locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
        smoothMobile: false,
        multiplier: 1,
        class: "is-revealed",
        scrollbarContainer: null,
        resetNativeScroll: true,
        lerp: 0.08,
        getDirection: true,
        getSpeed: false,
        reloadOnContextChange: true
    });

    // Update ScrollTrigger on scroll
    locoScroll.on("scroll", ScrollTrigger.update);

    // Setup ScrollTrigger proxy
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length 
                ? locoScroll.scrollTo(value, 0, 0) 
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
    });

    // Refresh ScrollTrigger when Locomotive Scroll updates
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // Update on window resize
    window.addEventListener("resize", () => {
        locoScroll.update();
        ScrollTrigger.refresh();
    });

    // Initial refresh
    ScrollTrigger.refresh();
    
    // Setup about-me animation after Locomotive Scroll is ready
    setupAboutMeAnimation();
    
    // Setup back to top button after Locomotive Scroll is ready
    setupBackToTop();
}

// Initialize after DOM and images are loaded (loader will handle the timing)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for images to load
        window.addEventListener('load', () => {
            // Small delay to ensure loader has finished
            setTimeout(initLocomotiveScroll, 200);
        });
    });
} else {
    window.addEventListener('load', () => {
        // Small delay to ensure loader has finished
        setTimeout(initLocomotiveScroll, 200);
    });
}

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav');
const menuOverlay = document.getElementById('menuOverlay');

function closeMenu() {
    if (hamburger) hamburger.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (menuOverlay) {
            menuOverlay.classList.toggle('active');
        }
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }
}

// Navigation smooth scrolling - wait for locoScroll to be initialized
function setupNavigation() {
    document.querySelectorAll('#nav a').forEach(link => {
        // Remove any existing listeners by cloning the element
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                // Close menu first
                closeMenu();
                
                // Small delay to allow menu to close, then scroll
                setTimeout(() => {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement && locoScroll) {
                        locoScroll.scrollTo(targetElement);
                    }
                }, 300);
            }
        });
    });
}

// Setup navigation after a delay to ensure locoScroll is ready
setTimeout(setupNavigation, 500);

// Back to top button - setup after locoScroll is initialized
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) {
        console.warn('Back to top button not found');
        return;
    }

    if (locoScroll) {
        // Show/hide button based on scroll position
        locoScroll.on('scroll', (obj) => {
            if (obj.scroll.y > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (locoScroll) {
                locoScroll.scrollTo(0);
            }
        });
    } else {
        // Fallback if Locomotive Scroll is not available
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Back to top is now set up in initLocomotiveScroll function




document.addEventListener("mousemove", function(e) {
    gsap.to(cursor, {
        left: e.clientX - 10,  
        top: e.clientY - 10,   
        duration: 0.5,
        ease: "power2.out"
    });
});


a.forEach(el => {
    el.addEventListener("mouseenter",function(){
        gsap.to(cursor,{
            scale:2
        })
    })
});


a.forEach(el => {
    el.addEventListener("mouseleave",function(){
        gsap.to(cursor,{
            scale:1
        })
    })
});


big.forEach(el => {
    el.addEventListener("mouseenter",function(){
        gsap.to(cursor,{
            scale:2.5
        })
    })
});

big.forEach(el=>{
    el.addEventListener("mouseleave",function(){
        gsap.to(cursor,{
            scale:1
        })
    })
})

const path = "M 0 80 Q 500 80 1000 80";

lines.forEach(el => {
  const currentPath = el.querySelector("path");

  el.addEventListener("mousemove", function (e) {
    let y = Math.min(Math.max(e.offsetY, 20), 140);
    const final_path = `M 0 80 Q 500 ${y} 1000 80`;

    gsap.to(currentPath, {
      attr: { d: final_path },
      duration: 0.2,
      ease: "power3.out"
    });
  });

  el.addEventListener("mouseleave", function () {
    gsap.to(currentPath, {
      attr: { d: path },
      duration: 2,
      ease: "elastic.out(1,0.18)"
    });
  });
});


// Seamless infinite scroll - using fromTo for seamless loop
function createSeamlessScroll(selector, duration) {
  const wrapper = document.querySelector(selector + " .imgs-wrapper");
  if (!wrapper) return null;
  
  // Use fromTo to create seamless infinite scroll
  // Start at 0%, animate to -50%, then seamlessly reset
  const tl = gsap.fromTo(selector + " .imgs-wrapper", 
    { xPercent: 0 },
    {
      xPercent: -50,
      duration: duration,
      ease: "none",
      repeat: -1,
      immediateRender: true
    }
  );
  
  return tl;
}

const tl1 = createSeamlessScroll("#first", 20);
const tl2 = createSeamlessScroll("#second", 20);

// Pause/resume only on hover of first row
document.querySelectorAll("#first .img-box").forEach(img => {
  img.addEventListener("mouseenter", () => tl1.pause());
  img.addEventListener("mouseleave", () => tl1.resume());
});

// Pause/resume only on hover of second row
document.querySelectorAll("#second .img-box").forEach(img => {
  img.addEventListener("mouseenter", () => tl2.pause());
  img.addEventListener("mouseleave", () => tl2.resume());
});





import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

// Responsive canvas sizing
function getCanvasSize() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    if (isSmallMobile) {
        return { width: 300, height: 300 };
    } else if (isMobile) {
        return { width: 500, height: 500 };
    }
    return { width: 700, height: 700 };
}

let size = getCanvasSize();
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 1, 1000);
camera.position.z = 40;
scene.add(camera);

const target = document.querySelector('.canvas');
const renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true });
renderer.setSize(size.width, size.height);

// Handle window resize
window.addEventListener('resize', () => {
    size = getCanvasSize();
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});

renderer.setClearColor(0x111111, 1);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 20);
scene.add(directionalLight);

let cylinder;

const loader = new THREE.TextureLoader();
loader.load('ss.png', (texture) => {
  texture.repeat.set(1, 1); // Ensure the texture fits the cylinder

  const geometry = new THREE.CylinderGeometry(12, 12, 16, 64, 1, true);


  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    color: 0xFFFFFF,
    opacity: 1.0,
    transparent: true,
    depthWrite: true,
    depthTest: true,
  });

  cylinder = new THREE.Mesh(geometry, material);
  cylinder.rotation.x = -10 * (Math.PI / 180);
  // cylinder.rotation.x = Math.PI / 4; // 45 degrees
  cylinder.rotation.z = Math.PI / 9;
  scene.add(cylinder);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;
controls.enableZoom = false;




function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (cylinder) {
    cylinder.rotation.y += 0.01; // Continuous spin only on Y axis
  }

  renderer.render(scene, camera);
}
animate();



// gsap.to(".be-end #norm",{
//   transform:"translateX(-100%)",
//   scrollTrigger:{
//     trigger:".be-end",
//     start:"top",
//     end:"top -600%",
//     scrub:2,
    
//     pin:true,
//   },
//   ease: "power1.out"
// })



// About Me animation - setup after Locomotive Scroll is initialized
function setupAboutMeAnimation() {
    var aboutPara = document.querySelector(".about-me p");
    
    if (!aboutPara) return;
    
    // Check if spans are already created
    if (aboutPara.querySelectorAll('span').length === 0) {
        var clut = "";
        aboutPara.textContent.split(" ").forEach(function (dets) {
            clut += `<span>${dets}</span> `;
        });
        aboutPara.innerHTML = clut;
    }

    // Create the animation with proper ScrollTrigger
    gsap.to(".about-me p span", {
        scrollTrigger: {
            trigger: ".about-me",
            scroller: "#main",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
            // markers: true // Uncomment to debug
        },
        stagger: 0.2,
        color: "white"
    });
    
    // Refresh ScrollTrigger after creating the animation
    ScrollTrigger.refresh();
}



// Canvas portion

// const canvas = document.querySelector("#page canvas");
// const context = canvas.getContext("2d");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;


// window.addEventListener("resize", function () {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   render();
// });

// const frameCount = 181;  

// function files(index) {
//   const padded = String(index + 1).padStart(3, '0');  
//   console.log(`./frames/ezgif-frame-${padded}.jpg`)

//   return `./frames/ezgif-frame-${padded}.jpg`;
// }



// const images = [];
// const imageSeq = {
//   frame: 1,
// };

// for (let i = 0; i < frameCount; i++) {
//   const img = new Image();
//   img.src = files(i);
//   images.push(img);
// }

// gsap.to(imageSeq, {
//   frame: frameCount - 1,
//   snap: "frame",
//   ease: `none`,
//   scrollTrigger: {
//     scrub: 0.15,
//     trigger: `#page>canvas`,
//     start: `top top`,
//     end: `600% top`,
//     scroller: `#main`,
//   },
//   onUpdate: render,
// });

// images[1].onload = render;

// function render() {
//   scaleImage(images[imageSeq.frame], context);
// }

// function scaleImage(img, ctx) {
//   var canvas = ctx.canvas;
//   var hRatio = canvas.width / img.width;
//   var vRatio = canvas.height / img.height;
//   var ratio = Math.max(hRatio, vRatio);
//   var centerShift_x = (canvas.width - img.width * ratio) / 2;
//   var centerShift_y = (canvas.height - img.height * ratio) / 2;
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.drawImage(
//     img,
//     0,
//     0,
//     img.width,
//     img.height,
//     centerShift_x,
//     centerShift_y,
//     img.width * ratio,
//     img.height * ratio
//   );
// }
// ScrollTrigger.create({
//   trigger: "#page>canvas",
//   pin: true,
//   // markers:true,
//   scroller: `#main`,
//   start: `top top`,
//   end: `600% top`,
// });

document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (name && email && message) {
                const terminalMessage = document.getElementById('terminal-message');
                
                // Show terminal message
                terminalMessage.classList.add('show');
                
                // Reset form
                this.reset();
                
                // Hide message after 3 seconds
                setTimeout(() => {
                    terminalMessage.classList.remove('show');
                }, 3000);
            }
        });

        // Add focus effect to inputs
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateX(5px)';
                this.parentElement.style.transition = 'transform 0.3s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateX(0)';
            });
        });