import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function CanvasAAFInicioCopy2() {
  /** Renders the AAF_inicio Copy 2 static HTML content within a React page.
   *  - Loads HTML from /assets/aafinicio-copy-2-2001-3396.html and injects into a scoped wrapper.
   *  - Dynamically injects CSS /assets/aafinicio-copy-2-2001-3396.css and removes on unmount.
   *  - Dynamically injects JS /assets/aafinicio-copy-2-2001-3396.js and removes on unmount.
   *  - Centers and scales the 1920x1080 artboard responsively inside the viewport.
   *  - Guards against global CSS leakage by using a data-attribute wrapper and only adding a page-specific <link>.
   *  - Mitigates ResizeObserver loop warnings by debouncing/throttling callbacks and disconnecting on unmount.
   */
  const wrapperRef = useRef(null);
  const [html, setHtml] = useState('');
  const linkRefs = useRef([]);
  const scriptRef = useRef(null);

  // Utility: debounce with RAF fallback to avoid ResizeObserver loop saturation
  const createRafDebounce = (fn, delay = 50) => {
    let timer = null;
    let rafId = null;
    const clearTimers = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    const debounced = (...args) => {
      clearTimers();
      timer = setTimeout(() => {
        rafId = requestAnimationFrame(() => fn(...args));
      }, delay);
    };
    debounced.cancel = clearTimers;
    return debounced;
  };

  // Load the HTML as text and inject into the wrapper
  useEffect(() => {
    let isActive = true;

    async function loadHtml() {
      try {
        const res = await fetch('/assets/aafinicio-copy-2-2001-3396.html', { cache: 'no-cache' });
        if (!res.ok) {
          // If dev server returned index.html or an error page, content-type might be text/html; check basic signal
          const ct = res.headers.get('content-type') || '';
          if (!ct.includes('text/html')) {
            throw new Error(`Unexpected content-type: ${ct}`);
          }
        }
        const text = await res.text();

        // If this is a whole document, parse safely and extract main; otherwise assume it's just fragment
        const temp = document.createElement('div');
        temp.innerHTML = text;

        // Most likely path: index.html is returned => has <html> and <body>; we only want our main
        const main = temp.querySelector('#screen-aafinicio-copy-2');
        if (main && isActive) {
          setHtml(main.outerHTML);
        } else if (isActive) {
          // Basic guard: if the text starts with "<!DOCTYPE" or "<html", it's likely entire doc from dev server,
          // which means wrong path or mis-served asset; avoid injecting it to prevent "Unexpected token <" downstream usage.
          const isWholeDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(text);
          if (isWholeDoc) {
            console.error('Received a full HTML document instead of the expected fragment. Check asset path.');
            setHtml('<div style="color:#fff;padding:16px;">Failed to load canvas content. Please check static asset path.</div>');
          } else {
            setHtml(text);
          }
        }
      } catch (e) {
        console.error('Failed to load canvas HTML:', e);
        if (isActive) {
          setHtml('<div style="color:#fff;padding:16px;">Error loading canvas content.</div>');
        }
      }
    }

    loadHtml();
    return () => {
      isActive = false;
    };
  }, []);

  // Inject CSS link(s) into head, scoped by page lifecycle (remove on unmount)
  useEffect(() => {
    const links = [];

    const attachLink = (href, dataTag) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href; // absolute path ensures CRA serves from public/
      link.setAttribute('data-canvas-style', dataTag);
      document.head.appendChild(link);
      links.push(link);
    };

    // Add common then page-specific CSS
    attachLink('/assets/common.css', 'aaf-inicio-copy-2-common');
    attachLink('/assets/aafinicio-copy-2-2001-3396.css', 'aaf-inicio-copy-2');

    linkRefs.current = links;

    return () => {
      // Cleanup all appended links
      linkRefs.current.forEach(l => {
        if (l && l.parentNode) l.parentNode.removeChild(l);
      });
      linkRefs.current = [];
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

    const onError = () => {
      console.error('Failed to load canvas script at /assets/aafinicio-copy-2-2001-3396.js');
    };
    script.addEventListener('error', onError);

    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.removeEventListener('error', onError);
        if (scriptRef.current.parentNode) {
          scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
      }
    };
  }, [html]);

  // Resize handling: center and scale the fixed-size 1920x1080 artboard with debounced observer
  useEffect(() => {
    const designW = 1920;
    const designH = 1080;

    const computeScale = () => {
      const container = wrapperRef.current;
      if (!container) return;

      const vw = container.clientWidth || 0;
      const vh = container.clientHeight || 0;

      const scale = Math.min(vw / designW, vh / designH, 1); // avoid upscaling to reduce blur
      const inner = container.querySelector('[data-artboard]');
      if (inner) {
        inner.style.transform = `scale(${Number.isFinite(scale) ? scale : 1})`;
        inner.style.width = `${designW}px`;
        inner.style.height = `${designH}px`;
      }
    };

    const debouncedCompute = createRafDebounce(computeScale, 60);

    const ro = new ResizeObserver(() => {
      debouncedCompute();
    });

    if (wrapperRef.current) {
      // Observe wrapper size changes only (not the entire subtree) to reduce loops
      ro.observe(wrapperRef.current);
    }

    window.addEventListener('resize', debouncedCompute);
    // Initial calculation scheduled
    debouncedCompute();

    return () => {
      window.removeEventListener('resize', debouncedCompute);
      debouncedCompute.cancel();
      try {
        ro.disconnect();
      } catch (e) {
        // noop
      }
    };
  }, [wrapperRef, html]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.canvasWrapper} ref={wrapperRef} id="aaf-inicio-copy-2-canvas" data-canvas-wrapper>
          <div
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
  },
};
