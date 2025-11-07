import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function CanvasAAFInicioCopy2() {
  /** Renders the AAF_inicio Copy 2 static HTML content within a React page.
   *  - Loads HTML from /assets/aafinicio-copy-2-2001-3396.html and injects into a scoped wrapper.
   *  - Dynamically injects CSS /assets/aafinicio-copy-2-2001-3396.css and removes on unmount.
   *  - Dynamically injects JS /assets/aafinicio-copy-2-2001-3396.js and removes on unmount.
   *  - Centers and scales the 1920x1080 artboard responsively inside the viewport.
   *  - Guards against global CSS leakage by using a data-attribute wrapper and only adding a page-specific <link>.
   */
  const wrapperRef = useRef(null);
  const [html, setHtml] = useState('');
  const linkRef = useRef(null);
  const scriptRef = useRef(null);

  // Load the HTML as text and inject into the wrapper
  useEffect(() => {
    let isActive = true;

    async function loadHtml() {
      try {
        const res = await fetch('/assets/aafinicio-copy-2-2001-3396.html', { cache: 'no-cache' });
        const text = await res.text();

        // Extract only the <main id="screen-aafinicio-copy-2">...</main> to avoid adding duplicate head/body
        const temp = document.createElement('div');
        temp.innerHTML = text;

        const main = temp.querySelector('#screen-aafinicio-copy-2');
        if (main && isActive) {
          setHtml(main.outerHTML);
        } else if (isActive) {
          // Fallback: inject full HTML; styles still loaded via link below
          setHtml(text);
        }
      } catch (e) {
        console.error('Failed to load canvas HTML:', e);
      }
    }

    loadHtml();
    return () => {
      isActive = false;
    };
  }, []);

  // Inject CSS link into head, scoped by page lifecycle (remove on unmount)
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/aafinicio-copy-2-2001-3396.css';
    link.setAttribute('data-canvas-style', 'aaf-inicio-copy-2');
    document.head.appendChild(link);
    linkRef.current = link;

    // Also add the common.css needed by the HTML (added per page to reduce global leakage risk)
    const common = document.createElement('link');
    common.rel = 'stylesheet';
    common.href = '/assets/common.css';
    common.setAttribute('data-canvas-style', 'aaf-inicio-copy-2-common');
    document.head.appendChild(common);

    return () => {
      if (linkRef.current && linkRef.current.parentNode) {
        linkRef.current.parentNode.removeChild(linkRef.current);
      }
      const commonEl = document.querySelector('link[data-canvas-style="aaf-inicio-copy-2-common"]');
      if (commonEl && commonEl.parentNode) {
        commonEl.parentNode.removeChild(commonEl);
      }
    };
  }, []);

  // Inject JS script only when the HTML is mounted; clean up on unmount to avoid multiple inits
  useEffect(() => {
    if (!html) return;

    const script = document.createElement('script');
    script.src = '/assets/aafinicio-copy-2-2001-3396.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('data-canvas-script', 'aaf-inicio-copy-2');
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [html]);

  // Resize handling: center and scale the fixed-size 1920x1080 artboard
  useEffect(() => {
    const handleResize = () => {
      const container = wrapperRef.current;
      if (!container) return;

      const designW = 1920;
      const designH = 1080;

      const vw = container.clientWidth;
      const vh = container.clientHeight;

      const scale = Math.min(vw / designW, vh / designH, 1); // do not upscale beyond 1 by default
      const inner = container.querySelector('[data-artboard]');
      if (inner) {
        inner.style.transform = `scale(${scale})`;
        inner.style.width = `${designW}px`;
        inner.style.height = `${designH}px`;
      }
    };

    const ro = new ResizeObserver(handleResize);
    if (wrapperRef.current) {
      ro.observe(wrapperRef.current);
    }
    window.addEventListener('resize', handleResize);
    // Initial calculation
    setTimeout(handleResize, 0);

    return () => {
      window.removeEventListener('resize', handleResize);
      ro.disconnect();
    };
  }, [wrapperRef, html]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.canvasWrapper} ref={wrapperRef} id="aaf-inicio-copy-2-canvas" data-canvas-wrapper>
          <div
            // This inner wrapper provides transform scaling without altering absolute positions of the artboard children.
            data-artboard
            style={styles.artboardScaleWrapper}
          >
            <div
              data-scope="aaf-inicio-copy-2"
              // Dangerously inject only the <main> content or fallback HTML (already sanitized in asset)
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f1115',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
  },
  container: {
    flex: 1,
    display: 'grid',
    placeItems: 'center',
    padding: '16px',
  },
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 32px)',
    overflow: 'auto',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '12px',
    background: 'linear-gradient(180deg, rgba(37,99,235,0.06) 0%, rgba(15,17,21,0.9) 100%)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  artboardScaleWrapper: {
    position: 'relative',
    transformOrigin: 'top left',
    // The injected HTML includes a root with id="screen-aafinicio-copy-2" with absolute-positioned children.
  },
};
