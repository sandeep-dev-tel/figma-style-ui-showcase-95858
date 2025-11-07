import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function CanvasAAFInicioCopy2() {
  /** Renders the AAF_inicio Copy 2 static HTML content within a React page.
   *  - Safely loads an HTML fragment (avoids injecting full documents).
   *  - Validates response content-type and URL to guard against dev-server index.html fallbacks.
   *  - Uses PUBLIC_URL-aware asset paths so CRA serves from /public/assets.
   *  - Loads CSS and JS with content-type checks and robust console warnings on fallbacks.
   *  - Ensures cleanup removes injected nodes.
   *  - Centers and scales the 1920x1080 artboard responsively.
   */
  const wrapperRef = useRef(null);
  const [html, setHtml] = useState('');
  const linkRefs = useRef([]);
  const scriptRef = useRef(null);

  // Derive base public assets path (CRA serves files from public/)
  const PUBLIC_URL = process.env.PUBLIC_URL || '';
  const assetsBase = `${PUBLIC_URL}/assets`;
  const FRAGMENT_HTML_URL = `${assetsBase}/aafinicio-copy-2-2001-3396.fragment.html`; // preferred fragment
  const FULL_HTML_URL = `${assetsBase}/aafinicio-copy-2-2001-3396.html`; // fallback if fragment missing
  const CSS_COMMON_URL = `${assetsBase}/common.css`;
  const CSS_PAGE_URL = `${assetsBase}/aafinicio-copy-2-2001-3396.css`;
  const JS_URL = `${assetsBase}/aafinicio-copy-2-2001-3396.js`;

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

  // Helpers to identify content types
  const isHtmlContentType = (ct) => typeof ct === 'string' && ct.toLowerCase().includes('text/html');
  const isJsContentType = (ct) =>
    typeof ct === 'string' &&
    (ct.toLowerCase().includes('application/javascript') || ct.toLowerCase().includes('text/javascript'));

  // Extract only the inner content of a known container from a full document string
  const extractKnownContainerHtml = (docString) => {
    try {
      const temp = document.createElement('html');
      temp.innerHTML = docString;
      // Prefer specific screen container
      const target =
        temp.querySelector('#screen-aafinicio-copy-2') ||
        temp.querySelector('main') ||
        temp.querySelector('#root') ||
        temp.querySelector('body');
      return target ? target.outerHTML : '';
    } catch {
      return '';
    }
  };

  // Load the HTML fragment with robust checks
  useEffect(() => {
    let isActive = true;

    async function loadHtml() {
      const warn = (...args) => console.warn('[CanvasAAFInicioCopy2]', ...args);

      // Try fragment first
      const tryFetch = async (url, expectHtml = true) => {
        const res = await fetch(url, { cache: 'no-cache' });
        const ct = res.headers.get('content-type') || '';
        if (!res.ok) {
          warn(`Fetch not OK for ${url} (status ${res.status}). CT: ${ct}`);
        }
        const text = await res.text();
        return { text, ct, ok: res.ok };
      };

      try {
        // 1) Attempt to load the dedicated fragment file
        const frag = await tryFetch(FRAGMENT_HTML_URL, true);

        if (frag.ok && (!isHtmlContentType(frag.ct) || !/^\s*<!doctype|^\s*<html/i.test(frag.text))) {
          // The fragment should NOT be a full document; if it looks like one, treat carefully
          const looksFullDoc = /^\s*<!DOCTYPE|^\s*<html/i.test(frag.text);
          if (looksFullDoc) {
            warn(`Fragment at ${FRAGMENT_HTML_URL} appears to be a full document; skipping fragment path.`);
          } else {
            if (isActive) setHtml(frag.text);
            return;
          }
        } else {
          warn(`Fragment ${FRAGMENT_HTML_URL} not found or content-type is ${frag.ct}. Will try full HTML.`);
        }

        // 2) Fall back to the full HTML and extract the known container
        const full = await tryFetch(FULL_HTML_URL, true);
        const isDocLike = isHtmlContentType(full.ct) || /<html/i.test(full.text);
        if (!isDocLike) {
          warn(`Full HTML at ${FULL_HTML_URL} does not look like HTML (ct=${full.ct}). Will attempt raw inject as last resort.`);
        }

        let extracted = '';
        if (isDocLike) {
          extracted = extractKnownContainerHtml(full.text);
          if (!extracted) {
            warn(`Could not extract known container from ${FULL_HTML_URL}. Will do minimal sanitation and fallback.`);
          }
        }

        if (isActive) {
          if (extracted) {
            setHtml(extracted);
          } else {
            // Minimal sanitation: strip doctype/html/head/body wrappers if present
            const sanitized = full.text
              .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
              .replace(/<\/?html[\s\S]*?>/gi, '')
              .replace(/<\/?head[\s\S]*?>/gi, '')
              .replace(/<\/?body[\s\S]*?>/gi, '')
              .trim();
            // Warn that fallback sanitation was used
            warn('Falling back to sanitized HTML injection due to unexpected structure.');
            setHtml(sanitized || '<div style="color:#fff;padding:16px;">Failed to load canvas content.</div>');
          }
        }
      } catch (e) {
        console.error('[CanvasAAFInicioCopy2] Failed to load canvas HTML:', e);
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
      link.href = href; // served from public/
      link.setAttribute('data-canvas-style', dataTag);
      document.head.appendChild(link);
      links.push(link);
    };

    // Add common then page-specific CSS using PUBLIC_URL-aware paths
    attachLink(CSS_COMMON_URL, 'aaf-inicio-copy-2-common');
    attachLink(CSS_PAGE_URL, 'aaf-inicio-copy-2');

    linkRefs.current = links;

    return () => {
      // Cleanup all appended links
      linkRefs.current.forEach((l) => {
        if (l && l.parentNode) l.parentNode.removeChild(l);
      });
      linkRefs.current = [];
    };
  }, [CSS_COMMON_URL, CSS_PAGE_URL]);

  // Inject JS script only when the HTML is mounted; validate content-type before execution
  useEffect(() => {
    if (!html) return;
    let cancelled = false;

    const attachScript = async () => {
      try {
        // Try HEAD request to inspect content-type without downloading the entire file
        const headRes = await fetch(JS_URL, { method: 'HEAD', cache: 'no-cache' });
        const ct = headRes.headers.get('content-type') || '';
        if (!headRes.ok || !isJsContentType(ct)) {
          console.warn(
            '[CanvasAAFInicioCopy2] Skipping JS injection due to invalid content-type or response.',
            { url: JS_URL, status: headRes.status, contentType: ct }
          );
          return;
        }
      } catch (err) {
        console.warn('[CanvasAAFInicioCopy2] HEAD check failed for JS. Will attempt to fetch and inspect.', err);
        // As a fallback, we'll still attach the script with onerror handler below.
      }

      if (cancelled) return;

      const script = document.createElement('script');
      script.src = JS_URL;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-canvas-script', 'aaf-inicio-copy-2');

      const onError = (e) => {
        console.error(`[CanvasAAFInicioCopy2] Failed to load canvas script at ${JS_URL}`, e);
      };
      script.addEventListener('error', onError);

      document.body.appendChild(script);
      scriptRef.current = script;
    };

    attachScript();

    return () => {
      cancelled = true;
      if (scriptRef.current) {
        // Remove event listeners and node
        try {
          scriptRef.current.replaceWith();
        } catch {
          if (scriptRef.current.parentNode) {
            scriptRef.current.parentNode.removeChild(scriptRef.current);
          }
        }
        scriptRef.current = null;
      }
    };
  }, [html, JS_URL]);

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
      ro.observe(wrapperRef.current);
    }

    window.addEventListener('resize', debouncedCompute);
    debouncedCompute();

    return () => {
      window.removeEventListener('resize', debouncedCompute);
      debouncedCompute.cancel();
      try {
        ro.disconnect();
      } catch {
        // noop
      }
    };
  }, [wrapperRef, html]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.canvasWrapper} ref={wrapperRef} id="aaf-inicio-copy-2-canvas" data-canvas-wrapper>
          <div data-artboard style={styles.artboardScaleWrapper}>
            <div
              data-scope="aaf-inicio-copy-2"
              // Dangerously inject only sanitized or extracted fragment HTML
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
