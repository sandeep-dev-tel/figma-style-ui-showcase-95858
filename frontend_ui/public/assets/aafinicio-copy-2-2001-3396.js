(function() {
  'use strict';
  // PUBLIC_INTERFACE
  function initAafInicioCopy2() {
    /** Initialize screen AAF_inicio Copy 2: size lock and debug attributes. */
    var root = document.getElementById('screen-aafinicio-copy-2');
    if (!root) return;
    // Lock viewport scrolling inside screen if embedded in a page
    document.body.style.overflow = 'auto';

    // Ensure root matches artboard size
    root.style.width = '1920px';
    root.style.height = '1080px';

    // Add data attributes for tracing if missing
    root.setAttribute('data-figma-artboard-width', '1920');
    root.setAttribute('data-figma-artboard-height', '1080');
  }

  document.addEventListener('DOMContentLoaded', initAafInicioCopy2);
})();
