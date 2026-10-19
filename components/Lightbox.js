"use client";
// Click any case study image to see it full size. Esc, click, or the × closes it.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Lightbox() {
  const [img, setImg] = useState(null);
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target.closest("img.cs2-media, .cs2-phones img");
      if (t) setImg({ src: t.currentSrc || t.src, alt: t.alt });
    };
    const onKey = (e) => e.key === "Escape" && setImg(null);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", onClick); document.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { document.documentElement.style.overflow = img ? "hidden" : ""; }, [img]);
  return (
    <AnimatePresence>
      {img && (
        <motion.div className="lb" role="dialog" aria-modal="true" aria-label={img.alt || "Image"}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setImg(null)}>
          <motion.img src={img.src} alt={img.alt} initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }} />
          <button type="button" className="lb-x" aria-label="Close">×</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
