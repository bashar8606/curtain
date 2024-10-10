gsap.registerPlugin(ScrollTrigger);
function WEBGL(set) {
  const webGLCurtain = new Curtains({ container: set.canvas });
  const planeElements = Array.from(set.planeElements); // Convert to an array
  
  const params = {
    vertexShader: document.getElementById("vs").textContent, // vertex shader ID
    fragmentShader: document.getElementById("fs").textContent, // fragment shader ID
    uniforms: {
      time: {
        name: "uTime", // uniform name that will be passed to our shaders
        type: "1f", // this means our uniform is a float
        value: 0
      },
      mousepos: {
        name: "uMouse",
        type: "2f",
        value: [0, 0]
      },
      resolution: {
        name: "uReso",
        type: "2f",
        value: [innerWidth, innerHeight]
      },
      progress: {
        name: "uProgress",
        type: "1f",
        value: 0
      }
    }
  };

  

  // Initialize the planes
  function initPlanes() {
    planeElements.forEach((planeElement) => {
      const plane = webGLCurtain.addPlane(planeElement, params);
      
      if (plane) {
        plane.onReady(() => {
          update(plane);
          // initEvent(plane, planeElement);
          initScrollTrigger(plane, planeElement);
        });
      }
    });
  }

  // Update function to modify plane uniforms on render
  function update(plane) {
    plane.onRender(() => {
      plane.uniforms.time.value += 0.01; // update time uniform value
      plane.uniforms.resolution.value = [innerWidth, innerHeight];
    });
  }

  // Initialize mouse event listeners for animations
  function initEvent(plane, planeElement) {
    planeElement.addEventListener("mouseenter", () => {
      gsap.to(plane.uniforms.progress, 1, {
        value: 1,
        ease: "expo.inOut"
      });
    });

    planeElement.addEventListener("mouseout", () => {
      gsap.to(plane.uniforms.progress, 1, {
        value: 0,
        ease: "expo.inOut"
      });
    });
  }


  function initScrollTrigger(plane, planeElement) {
    gsap.to(plane.uniforms.progress, {
      value: 1,
      // ease: "expo.inOut",
      ease: "none",

      scrollTrigger: {
        trigger: planeElement,
        start: "top bottom", 
        end: "top 50%",  
        scrub: 0.5,   
      }
    });
  }

  return {
    initPlanes
  };
}

// Instantiate and initialize WEBGL with multiple plane elements
const webgl = WEBGL({
  canvas: "canvas",
  planeElements: document.getElementsByClassName("plane") // Select all elements with the class 'plane'
});

webgl.initPlanes();
