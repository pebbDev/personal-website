import * as motion from "motion/react-client";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { previewRoutes } from "@/lib/navigation/config";
import GalleryCabinet from "../components/GalleryCabinet";
import { galleryCategories } from "../constants";

const viewport = { once: true, amount: 0.08, margin: "0px 0px -6% 0px" } as const;
const ease = [0.16, 1, 0.3, 1] as const;

export default function Gallery() {
  return (
    <section id="gallery" className="home-section home-gallery" aria-labelledby="gallery-heading">
      <div className="home-wrap">
        <motion.div
          className="home-gallery-head home-gallery-reveal"
          initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewport}
          transition={{ duration: 0.9, ease }}
        >
          <p className="home-eyebrow">Archive</p>
          <h2 id="gallery-heading" className="home-heading">
            My Gallery
          </h2>
          <p className="home-copy">An archive of explorations, visual systems, and creative process studies.</p>
        </motion.div>
        <GalleryCabinet categories={galleryCategories} />
        <motion.div
          className="home-gallery-cta home-gallery-reveal"
          initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={viewport}
          transition={{ duration: 0.9, ease }}
        >
          <Button variant="primary" href={previewRoutes.work}>
            See all projects <Folder aria-hidden="true" size={20} strokeWidth={1.8} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
