import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export function usePageMeta({ title, description, ogImage, jsonLd }: PageMetaOptions) {
  useEffect(() => {
    document.title = title;

    // Update Meta Description
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
      
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);
    }

    // Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    // Update OG Image
    if (ogImage) {
      let ogImgMeta = document.querySelector('meta[property="og:image"]');
      if (!ogImgMeta) {
        ogImgMeta = document.createElement("meta");
        ogImgMeta.setAttribute("property", "og:image");
        document.head.appendChild(ogImgMeta);
      }
      ogImgMeta.setAttribute("content", ogImage);
    }

    // JSON-LD Structured Data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      // Optional: Cleanup specific metas on unmount if they should not persist globally
    };
  }, [title, description, ogImage, jsonLd]);
}
