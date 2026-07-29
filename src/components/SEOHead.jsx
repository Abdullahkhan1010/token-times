import React, { useEffect } from "react";
import { BASE_URL, DEFAULT_SEO, PAGE_SEO_DATA } from "../data/seoData";

/**
 * Reusable SEO Head Manager Component
 * Dynamically updates document head attributes, Open Graph tags, Twitter Cards, canonical link, and JSON-LD schemas.
 */
export default function SEOHead({
  pageKey = "Home",
  customTitle,
  customDescription,
  customKeywords,
  customImage,
  customPath,
  articleMeta,
  customSchema,
}) {
  const pageData = PAGE_SEO_DATA[pageKey] || PAGE_SEO_DATA.Home;

  const rawTitle = customTitle || pageData.title || DEFAULT_SEO.defaultTitle;
  const title = rawTitle.includes("Token Times") ? rawTitle : `${rawTitle} | Token Times`;
  const description = customDescription || pageData.description || DEFAULT_SEO.description;
  const keywords = customKeywords || pageData.keywords || DEFAULT_SEO.keywords;
  const path = customPath || pageData.path || "/";
  const canonicalUrl = `${BASE_URL}${path === "/" ? "" : path}`;
  const ogImage = customImage || pageData.ogImage || DEFAULT_SEO.ogImage;
  const type = articleMeta ? "article" : pageData.type || DEFAULT_SEO.type;

  useEffect(() => {
    // 1. Set Title
    document.title = title;

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attribute, attributeValue, contentValue) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Helper function for link tags
    const setLinkTag = (rel, href) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', "name", "description", description);
    setMetaTag('meta[name="keywords"]', "name", "keywords", keywords);
    setMetaTag('meta[name="robots"]', "name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMetaTag('meta[name="author"]', "name", "author", articleMeta?.author || DEFAULT_SEO.author);
    setMetaTag('meta[name="publisher"]', "name", "publisher", DEFAULT_SEO.publisher);

    // 3. Canonical Link
    setLinkTag("canonical", canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:type"]', "property", "og:type", type);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", ogImage);
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", DEFAULT_SEO.siteName);
    setMetaTag('meta[property="og:locale"]', "property", "og:locale", DEFAULT_SEO.locale);

    if (articleMeta) {
      if (articleMeta.publishedTime) {
        setMetaTag('meta[property="article:published_time"]', "property", "article:published_time", articleMeta.publishedTime);
      }
      if (articleMeta.section) {
        setMetaTag('meta[property="article:section"]', "property", "article:section", articleMeta.section);
      }
      if (articleMeta.author) {
        setMetaTag('meta[property="article:author"]', "property", "article:author", articleMeta.author);
      }
    }

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMetaTag('meta[name="twitter:site"]', "name", "twitter:site", DEFAULT_SEO.twitterHandle);
    setMetaTag('meta[name="twitter:creator"]', "name", "twitter:creator", DEFAULT_SEO.twitterHandle);
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", ogImage);

    // 6. JSON-LD Schemas Injection
    const schemasToInject = [];
    if (pageData.schema) {
      if (Array.isArray(pageData.schema)) {
        schemasToInject.push(...pageData.schema);
      } else {
        schemasToInject.push(pageData.schema);
      }
    }
    if (customSchema) {
      if (Array.isArray(customSchema)) {
        schemasToInject.push(...customSchema);
      } else {
        schemasToInject.push(customSchema);
      }
    }

    let scriptTag = document.getElementById("seo-json-ld");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-json-ld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemasToInject);

  }, [
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage,
    type,
    pageData,
    articleMeta,
    customSchema,
  ]);

  return null;
}
