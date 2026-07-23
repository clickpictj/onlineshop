/* =========================================================
   CLICK PIC — site logic
   ========================================================= */
(function () {
  "use strict";

  /* Suppress third-party Instagram embed console errors & policy violations */
  (function filterConsoleNoise() {
    const _e = console.error, _w = console.warn, _i = console.info;
    function isNoise(args) {
      const str = Array.from(args).map(a => (a && a.stack) ? a.stack : String(a)).join(" ");
      return (
        str.includes("cdninstagram") ||
        str.includes("instagram.com") ||
        str.includes("Permissions policy violation") ||
        str.includes("unload") ||
        str.includes("PendingScript") ||
        str.includes("[Violation]")
      );
    }
    console.error = function (...args) { if (!isNoise(args)) _e.apply(console, args); };
    console.warn = function (...args) { if (!isNoise(args)) _w.apply(console, args); };
    console.info = function (...args) { if (!isNoise(args)) _i.apply(console, args); };
  })();

  /* ---------------------------------------------------------
     DATA
  --------------------------------------------------------- */
  // Real Click Pic catalogue — 12 shop categories covering the full product range
  const CATEGORIES = [
    { id: "mugs", name: "Mugs", icon: "☕" },
    { id: "keychains", name: "Key Chains", icon: "🔑" },
    { id: "wooden", name: "Wooden Engraving", icon: "🪵" },
    { id: "nameboards", name: "Name Boards & LED Signs", icon: "💡" },
    { id: "mobile", name: "Mobile Accessories", icon: "📱" },
    { id: "apparel", name: "T-Shirts & Printing", icon: "👕" },
    { id: "frames", name: "Photo Frames", icon: "🖼" },
    { id: "jewellery", name: "Rings, Chains & Jewellery", icon: "💍" },
    { id: "homedecor", name: "Home & Table Decor", icon: "🏠" },
    { id: "writing", name: "Pens & Stationery", icon: "✏️" },
    { id: "drinkware", name: "Sippers & Bottles", icon: "🥤" },
    { id: "giftservices", name: "Return Gifting & Services", icon: "🎁" }
  ];

  const OCCASIONS = ["birthday", "anniversary", "wedding", "bestwishes", "housewarming", "rakhi"];

  const PRODUCT_BG = ["#EAF3F8", "#FDEBEC", "#EFF7E4", "#E9F0FB", "#FCEFE0", "#F1EAFB"];

  // All product photography lives locally at media/products/
  const IMG_BASE = "media/products/";

  // Real catalogue — name, category, image file, price (₹) taken from the
  // Click Pic price list. MRP is derived so a small "was" discount can show.
  const RAW_PRODUCTS = [
    // Mugs
    { name: "Normal Photo Mug", category: "mugs", img: "normal_mug.png", price: 249, occasion: "birthday" },
    { name: "Magic Color-Changing Mug", category: "mugs", img: "magic_mug.png", price: 349, occasion: "birthday" },
    { name: "Personalised Photo Mug", category: "mugs", img: "mugs.png", price: 249, occasion: "bestwishes" },

    // Key Chains
    { name: "Wooden Photo Key Chain", category: "keychains", img: "kc_wooden_key_chain.png", price: 199, occasion: "bestwishes" },
    { name: "Metal Photo Key Chain", category: "keychains", img: "kc_metal_key_chain.png", price: 249, occasion: "bestwishes" },
    { name: "MDF Photo Key Chain", category: "keychains", img: "kc_mdf_key_chain.png", price: 129, occasion: "rakhi" },
    { name: "Acrylic Photo Key Chain", category: "keychains", img: "kc_acrylic_key_chain.png", price: 149, occasion: "bestwishes" },
    { name: "Resin Photo Key Chain", category: "keychains", img: "kc_resin_key_chain.png", price: 299, occasion: "anniversary" },
    { name: "Classic Photo Key Chain", category: "keychains", img: "key_chain.png", price: 149, occasion: "rakhi" },

    // Wooden Engraving
    { name: "Unique Shape Wooden Engraving", category: "wooden", img: "unique_shape_engraving.png", price: 999, occasion: "wedding", isNew: true },
    { name: "Square Wooden Engraving", category: "wooden", img: "we_square.png", price: 499, occasion: "anniversary" },
    { name: "Heart Wooden Engraving", category: "wooden", img: "we_heart.png", price: 1299, occasion: "anniversary" },
    { name: "Clock Square Wooden Engraving", category: "wooden", img: "we_clock_square.png", price: 1499, occasion: "housewarming" },
    { name: "Oval Shape Wooden Engraving", category: "wooden", img: "we_oval_shape.png", price: 999, occasion: "wedding" },
    { name: "Classic Wooden Engraving", category: "wooden", img: "wooden_engraving.png", price: 799, occasion: "anniversary" },

    // Name Boards & LED Signs
    { name: "Home Name Board", category: "nameboards", img: "home_name_board.png", price: 1499, occasion: "housewarming" },
    { name: "Shop LED Board", category: "nameboards", img: "shop_led_board.png", price: 4999, occasion: "housewarming" },
    { name: "Custom Name Board", category: "nameboards", img: "name_board.png", price: 1499, occasion: "housewarming" },

    // Mobile Accessories
    { name: "Personalised Mobile Case", category: "mobile", img: "mobile_case.png", price: 299, occasion: "birthday" },
    { name: "Custom Mobile Skin", category: "mobile", img: "mobile_skin.png", price: 199, occasion: "birthday" },
    { name: "Mobile Case Printing", category: "mobile", img: "mobile_case_print.png", price: 299, occasion: "bestwishes" },

    // T-Shirts & Printing
    { name: "Custom Printed T-Shirt", category: "apparel", img: "t_shirt.png", price: 399, occasion: "birthday" },
    { name: "T-Shirt Printing Service", category: "apparel", img: "t_shirt_print.png", price: 399, occasion: "bestwishes" },

    // Photo Frames
    { name: "3D Wooden Photo Frame", category: "frames", img: "3d_wooden_frame.png", price: 2999, occasion: "anniversary", isNew: true },
    { name: "Custom Cutout Photo Frame", category: "frames", img: "cutout_frame.png", price: 799, occasion: "birthday", isNew: true },
    { name: "Personalised Photo Frame", category: "frames", img: "photo_frame.png", price: 499, occasion: "anniversary" },

    // Jewellery / Kada / Pendant / Wallet / Rings & Chains
    { name: "Personalised Engraved Ring", category: "jewellery", img: "ring.png", price: 199, occasion: "anniversary", isNew: true },
    { name: "Personalised Photo Chain", category: "jewellery", img: "chain.png", price: 349, occasion: "birthday", isNew: true },
    { name: "Engraved Half Kada", category: "jewellery", img: "half_kada.png", price: 300, occasion: "rakhi", isNew: true },
    { name: "Couples Ring (Silver)", category: "jewellery", img: "couples_ring_silver.png", price: 299, occasion: "anniversary", isNew: true },
    { name: "Couples Ring (Gold)", category: "jewellery", img: "couples_ring_gold.png", price: 299, occasion: "anniversary", isNew: true },
    { name: "Hidden Dollar Chain", category: "jewellery", img: "hiden_dollar_chain.png", price: 399, occasion: "birthday", isNew: true },
    { name: "Engraved Kada", category: "jewellery", img: "kada.png", price: 500, occasion: "rakhi" },
    { name: "Men's Engraved Kada", category: "jewellery", img: "men.png", price: 499, occasion: "rakhi" },
    { name: "Photo Eye Pendant", category: "jewellery", img: "eye_pendant.png", price: 399, occasion: "wedding" },
    { name: "Personalised Wallet", category: "jewellery", img: "wallet.png", price: 699, occasion: "birthday" },

    // Home & Table Decor
    { name: "Table Tops Gifts", category: "homedecor", img: "table_tops_gifts.png", price: 499, occasion: "bestwishes", isNew: true },
    { name: "Table Top for Office", category: "homedecor", img: "table_top_for_office.png", price: 699, occasion: "housewarming", isNew: true },
    { name: "Moon Ball Lamp", category: "homedecor", img: "moon_ball.png", price: 1299, occasion: "anniversary" },
    { name: "Magic Mirror", category: "homedecor", img: "magic_mirror.png", price: 1499, occasion: "housewarming" },
    { name: "MDF Gifting Plaque", category: "homedecor", img: "mdf_gifting.png", price: 399, occasion: "bestwishes" },
    { name: "Table Top Gifting", category: "homedecor", img: "table_top_gifting.png", price: 599, occasion: "housewarming" },
    { name: "Personalised Photo Pillow", category: "homedecor", img: "pillows.png", price: 599, occasion: "housewarming" },

    // Pens & Stationery
    { name: "Customised Pen", category: "writing", img: "pen.png", price: 149, occasion: "bestwishes" },
    { name: "Customised Pencil", category: "writing", img: "customized_pencil.png", price: 49, occasion: "bestwishes" },

    // Sippers & Bottles
    { name: "Personalised Sipper Bottle", category: "drinkware", img: "sipper_bottle.png", price: 599, occasion: "birthday" },

    // Return Gifting & Services
    { name: "Custom Button Badge", category: "giftservices", img: "badge.png", price: 99, occasion: "birthday", isNew: true },
    { name: "Return Gifting Pack", category: "giftservices", img: "return_gifting.png", price: 99, occasion: "birthday" }
  ];

  function makeProducts() {
    const catMeta = {};
    CATEGORIES.forEach(c => catMeta[c.id] = c);
    return RAW_PRODUCTS.map((r, i) => {
      const id = i + 1;
      const cat = catMeta[r.category];
      const mrp = Math.round(r.price * 1.2 / 10) * 10; // shows a modest "was" price
      return {
        id: "p" + id,
        name: r.name,
        category: r.category,
        categoryName: cat.name,
        icon: cat.icon,
        img: IMG_BASE + r.img,
        bg: PRODUCT_BG[id % PRODUCT_BG.length],
        mrp: mrp,
        price: r.price,
        rating: (3.9 + (id % 11) / 10).toFixed(1),
        reviews: 15 + (id * 13) % 420,
        personalisable: !r.category.match(/giftservices/),
        occasion: r.occasion,
        isNew: !!r.isNew
      };
    });
  }
  const PRODUCTS = makeProducts();

  const REELS = [
    {
      title: "Unboxing a Surprise", views: "1.2K", cta: "GIFT UNBOXING",
      bg: "linear-gradient(160deg,#1EA7E0,#3E3A8C)",
      thumb: IMG_BASE + "customer_handover.png",
      reelId: "DLtuMNJxNN-"
    },
    {
      title: "Studio Behind-the-Scenes", views: "860", cta: "HOW IT'S MADE",
      bg: "linear-gradient(160deg,#ED1C24,#8DC63F)",
      thumb: IMG_BASE + "photo_printing_process.png",
      reelId: "C_ICGDnRmW5"
    },
    {
      title: "Name Board Reveal", views: "3.4K", cta: "NAME BOARDS",
      bg: "linear-gradient(160deg,#8DC63F,#1EA7E0)",
      thumb: IMG_BASE + "name_board.png",
      reelId: "C_GQUo7yz96"
    },
    {
      title: "Design Studio Walkthrough", views: "2.1K", cta: "TRY IT NOW",
      bg: "linear-gradient(160deg,#3E3A8C,#ED1C24)",
      thumb: IMG_BASE + "mugs.png",
      reelId: "C_GPL9DSa64"
    },
    {
      title: "Wooden Engraving Reveal", views: "980", cta: "WOODEN ENGRAVING",
      bg: "linear-gradient(160deg,#1EA7E0,#ED1C24)",
      thumb: IMG_BASE + "wooden_engraving.png",
      reelId: "C-Sqgs_Si3X"
    },
    {
      title: "Gift Wrapping Moment", views: "4.6K", cta: "GIFT WRAPPING",
      bg: "linear-gradient(160deg,#ED1C24,#3E3A8C)",
      thumb: IMG_BASE + "gift_wrapping_moment.png",
      reelId: "C8gT30oRmRp"
    },
    {
      title: "Customised Memory Frame", views: "5.2K", cta: "PHOTO FRAMES",
      bg: "linear-gradient(160deg,#8DC63F,#ED1C24)",
      thumb: IMG_BASE + "photo_frame.png",
      reelId: "C7exOLLSvm7"
    }
  ];

  const INSTA_POSTS = [
    {
      emoji: "📸", caption: "WE FIX BAD GIFTING DECISIONS",
      bg: "linear-gradient(150deg,#1EA7E0,#3E3A8C)",
      img: IMG_BASE + "brand_hero_tile.png",
      tags: "#click_pic_customized #givepicgetgift #thanjavur", date: "2 days ago", likes: "1.4K", isVideo: true, reelId: "DLtuMNJxNN-"
    },
    {
      emoji: "💍", caption: "Couples Rings — your love story, engraved",
      bg: "linear-gradient(150deg,#d6249f,#285AEB)",
      img: IMG_BASE + "couples_ring_gold.png",
      tags: "#couplesring #personalisedgifts #click_pic_customized", date: "1 day ago", likes: "2.3K", isVideo: false
    },
    {
      emoji: "⛓", caption: "Hidden Dollar Chain — always with you",
      bg: "linear-gradient(150deg,#3E3A8C,#ED1C24)",
      img: IMG_BASE + "hiden_dollar_chain.png",
      tags: "#dollarnecklace #customchain #click_pic_customized", date: "3 days ago", likes: "1.1K", isVideo: false
    },
    {
      emoji: "🖼", caption: "3D Wooden Frame — memories in 3 dimensions",
      bg: "linear-gradient(150deg,#8DC63F,#ED1C24)",
      img: IMG_BASE + "3d_wooden_frame.png",
      tags: "#3dframe #woodenframe #click_pic_customized", date: "4 days ago", likes: "1.7K", isVideo: false
    },
    {
      emoji: "✂️", caption: "Cutout Frame — shaped around your memories",
      bg: "linear-gradient(150deg,#ED1C24,#8DC63F)",
      img: IMG_BASE + "cutout_frame.png",
      tags: "#cutoutframe #photoframe #click_pic_customized", date: "5 days ago", likes: "986", isVideo: false
    },
    {
      emoji: "🏆", caption: "Unique Shape Engraving — totally one-of-a-kind",
      bg: "linear-gradient(150deg,#1EA7E0,#ED1C24)",
      img: IMG_BASE + "unique_shape_engraving.png",
      tags: "#uniqueshape #woodenengraving #click_pic_customized", date: "6 days ago", likes: "1.5K", isVideo: false
    },
    {
      emoji: "🏠", caption: "Table Tops Gifts — the perfect desk companion",
      bg: "linear-gradient(150deg,#3E3A8C,#8DC63F)",
      img: IMG_BASE + "table_tops_gifts.png",
      tags: "#tabletop #deskgifts #click_pic_customized", date: "1 week ago", likes: "823", isVideo: false
    },
    {
      emoji: "💼", caption: "Table Top for Office — personalise your workspace",
      bg: "linear-gradient(150deg,#1EA7E0,#3E3A8C)",
      img: IMG_BASE + "table_top_for_office.png",
      tags: "#officegift #corporategifting #click_pic_customized", date: "1 week ago", likes: "745", isVideo: false
    },
    {
      emoji: "📛", caption: "Custom Button Badge — wear your vibe",
      bg: "linear-gradient(150deg,#ED1C24,#1EA7E0)",
      img: IMG_BASE + "badge.png",
      tags: "#badge #custombadge #click_pic_customized", date: "2 weeks ago", likes: "612", isVideo: false
    },
    {
      emoji: "💍", caption: "Engraved Ring — carry your memory always",
      bg: "linear-gradient(150deg,#fd5949,#d6249f)",
      img: IMG_BASE + "ring.png",
      tags: "#engravedring #ring #click_pic_customized", date: "2 weeks ago", likes: "1.9K", isVideo: false
    },
    {
      emoji: "🎀", caption: "The unboxing feeling, every single time",
      bg: "linear-gradient(150deg,#ED1C24,#1EA7E0)",
      img: IMG_BASE + "gift_wrapping_moment.png",
      tags: "#giftwrapping #giftideas #click_pic_customized", date: "3 weeks ago", likes: "3.2K", isVideo: true, reelId: "C-Sqgs_Si3X"
    },
    {
      emoji: "🪵", caption: "Engraved to last a lifetime",
      bg: "linear-gradient(150deg,#1EA7E0,#ED1C24)",
      img: IMG_BASE + "wooden_engraving.png",
      tags: "#woodenengraving #click_pic_customized", date: "3 weeks ago", likes: "1.8K", isVideo: true, reelId: "C8gT30oRmRp"
    }
  ];

  const TESTIMONIALS = [
    { name: "Priya S.", loc: "Thanjavur", en: "Ordered a photo mug for my dad's birthday — the studio preview made it so easy to see exactly how it'd look. Delivered same evening!", ta: "என் அப்பாவின் பிறந்தநாளுக்கு போட்டோ மக் ஆர்டர் செய்தேன் — அதே மாலையே டெலிவரி கிடைத்தது!" },
    { name: "Arun K.", loc: "Kumbakonam", en: "Got a home name board made for our new house — the finish and font quality looked exactly like the design preview. Genuinely impressed.", ta: "எங்கள் புதிய வீட்டிற்கான நேம் போர்டு அற்புதமாக இருந்தது." },
    { name: "Meena R.", loc: "Thanjavur", en: "Sent them a request on WhatsApp, got a full itemised quote back in minutes. Ordering couldn't be simpler.", ta: "வாட்ஸ்அப்பில் ஆர்டர் செய்வது மிகவும் எளிதாக இருந்தது." },
    { name: "Karthik V.", loc: "Trichy", en: "The wooden engraving they made from our couple photo is now on our wall. Everyone who visits asks where we got it.", ta: "எங்கள் ஜோடி புகைப்படத்திலிருந்து செய்த வூட் என்கிரேவிங் அருமையாக இருந்தது." },
    { name: "Divya M.", loc: "Thanjavur", en: "Loved the little unboxing reel they sent after my key chain order — such a nice personal touch from a gifting brand.", ta: "ஆர்டருக்குப் பிறகு அனுப்பிய வீடியோ மிகவும் அழகாக இருந்தது." }
  ];

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  const state = {
    cart: JSON.parse(localStorage.getItem("cp_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("cp_wishlist") || "[]"),
    occasionFilter: "all",
    catFilters: new Set(),
    occFilters: new Set(),
    personalisableOnly: false,
    maxPrice: 5000,
    sort: "popular",
    visibleCount: 12
  };

  function saveState() {
    localStorage.setItem("cp_cart", JSON.stringify(state.cart));
    localStorage.setItem("cp_wishlist", JSON.stringify(state.wishlist));
  }

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  function money(n) { return "₹" + n.toLocaleString("en-IN"); }

  function fireShutter(el) {
    const ring = el.querySelector(".shutter-ring") || (function () {
      const r = document.createElement("div");
      r.className = "shutter-ring";
      el.style.position = el.style.position || "relative";
      el.appendChild(r);
      return r;
    })();
    ring.classList.remove("fire");
    void ring.offsetWidth;
    ring.classList.add("fire");
  }

  function bounceBadge(el) {
    el.classList.remove("bounce");
    void el.offsetWidth;
    el.classList.add("bounce");
  }

  /* ---------------------------------------------------------
     HEADER / MOBILE NAV
  --------------------------------------------------------- */
  const mobileNav = $("#mobileNav");
  $("#hamburgerBtn").addEventListener("click", () => mobileNav.classList.add("open"));
  $("#mobileCloseBtn").addEventListener("click", () => mobileNav.classList.remove("open"));
  $$(".mobile-nav a").forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));

  /* ---------------------------------------------------------
     COUNT-UP STATS
  --------------------------------------------------------- */
  function countUp(el, target, dur) {
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = Math.floor(p * target).toLocaleString("en-IN") + (p === 1 && el.dataset.suffix ? el.dataset.suffix : "");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp($("#statCategories"), CATEGORIES.length, 900);
        countUp($("#statGifts"), PRODUCTS.length, 1200);
        $("#statMinutes").dataset.suffix = "";
        countUp($("#statMinutes"), 30, 900);
        heroObserver.disconnect();
      }
    });
  }, { threshold: .4 });
  heroObserver.observe($(".hero-stats"));

  /* ---------------------------------------------------------
     SCROLL REVEAL (generic)
  --------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); } });
  }, { threshold: .12 });
  function observeReveal(el) { el.classList.add("reveal"); revealObserver.observe(el); }

  /* ---------------------------------------------------------
     CATEGORY GRID
  --------------------------------------------------------- */
  function renderCategoryGrid() {
    const grid = $("#categoryGrid");
    grid.innerHTML = CATEGORIES.map(c => `
    <div class="cat-item" data-cat="${c.id}">
      <div class="cat-avatar">${c.icon}</div>
      <span>${c.name}</span>
    </div>`).join("");
    $$(".cat-item", grid).forEach(item => {
      item.addEventListener("click", () => {
        state.catFilters = new Set([item.dataset.cat]);
        syncCatFilterCheckboxes();
        renderProductGrid();
        document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* ---------------------------------------------------------
     OCCASION STRIP
  --------------------------------------------------------- */
  function renderOccasionStrip() {
    $$(".occasion-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        $$(".occasion-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.occasionFilter = chip.dataset.occasion;
        renderProductGrid();
      });
    });
  }

  /* ---------------------------------------------------------
     FILTERS PANEL
  --------------------------------------------------------- */
  function renderFilterOptions() {
    const catWrap = $("#catFilterOpts");
    catWrap.innerHTML = CATEGORIES.map(c => `
    <label><input type="checkbox" value="${c.id}" class="cat-cb"> ${c.icon} ${c.name}</label>`).join("");
    $$(".cat-cb", catWrap).forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) state.catFilters.add(cb.value); else state.catFilters.delete(cb.value);
        renderProductGrid();
      });
    });

    const occWrap = $("#occFilterOpts");
    const labels = { birthday: "Birthday", anniversary: "Anniversary", wedding: "Wedding", bestwishes: "Best Wishes", housewarming: "Housewarming", rakhi: "Rakhi" };
    occWrap.innerHTML = OCCASIONS.map(o => `<label><input type="checkbox" value="${o}" class="occ-cb"> ${labels[o]}</label>`).join("");
    $$(".occ-cb", occWrap).forEach(cb => {
      cb.addEventListener("change", () => {
        if (cb.checked) state.occFilters.add(cb.value); else state.occFilters.delete(cb.value);
        renderProductGrid();
      });
    });

    $("#personalisableOnly").addEventListener("change", (e) => {
      state.personalisableOnly = e.target.checked;
      renderProductGrid();
    });

    $("#priceSlider").addEventListener("input", (e) => {
      state.maxPrice = parseInt(e.target.value, 10);
      $("#priceMaxDisplay").value = money(state.maxPrice);
      renderProductGrid();
    });

    $("#sortSelect").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProductGrid();
    });

    $("#clearFiltersBtn").addEventListener("click", () => {
      state.catFilters.clear(); state.occFilters.clear(); state.personalisableOnly = false;
      state.maxPrice = 5000; state.occasionFilter = "all"; state.sort = "popular";
      $("#priceSlider").value = 5000; $("#priceMaxDisplay").value = money(5000);
      $("#personalisableOnly").checked = false;
      $$(".cat-cb,.occ-cb").forEach(cb => cb.checked = false);
      $$(".occasion-chip").forEach(c => c.classList.remove("active"));
      $$(".occasion-chip")[0].classList.add("active");
      $("#sortSelect").value = "popular";
      renderProductGrid();
    });
  }
  function syncCatFilterCheckboxes() {
    $$(".cat-cb").forEach(cb => cb.checked = state.catFilters.has(cb.value));
  }

  /* ---------------------------------------------------------
     PRODUCT GRID
  --------------------------------------------------------- */
  function getFilteredProducts() {
    let list = PRODUCTS.filter(p => {
      if (state.occasionFilter !== "all" && p.occasion !== state.occasionFilter) return false;
      if (state.catFilters.size && !state.catFilters.has(p.category)) return false;
      if (state.occFilters.size && !state.occFilters.has(p.occasion)) return false;
      if (state.personalisableOnly && !p.personalisable) return false;
      if (p.price > state.maxPrice) return false;
      return true;
    });
    if (state.sort === "low") list.sort((a, b) => a.price - b.price);
    else if (state.sort === "high") list.sort((a, b) => b.price - a.price);
    else if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }

  function productCard(p) {
    const inWishlist = state.wishlist.includes(p.id);
    const mediaContent = p.img
      ? `<img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <span class="product-img-fallback" style="font-size:52px;display:none;">${p.icon}</span>`
      : `<span style="font-size:52px;">${p.icon}</span>`;
    return `
  <div class="product-card reveal in" data-id="${p.id}">
    <div class="product-media" style="background:${p.bg};">
      ${p.isNew ? '<span class="tag-new">✨ New</span>' : ""}
      ${p.personalisable ? '<span class="tag-personalisable">Personalisable</span>' : ""}
      <button class="wishlist-btn ${inWishlist ? "active" : ""}" data-wish="${p.id}" aria-label="Wishlist">${inWishlist ? "❤" : "♡"}</button>
      ${mediaContent}
    </div>
    <div class="product-info">
      <h4>${p.name}</h4>
      <div class="stars">★★★★★ <span class="count">${p.rating} (${p.reviews})</span></div>
      <div class="price-row"><span class="mrp">${money(p.mrp)}</span><span class="now">${money(p.price)}</span></div>
      <button class="add-cart-btn" data-add="${p.id}">Add to Cart</button>
    </div>
  </div>`;
  }

  function renderProductGrid() {
    const list = getFilteredProducts();
    const grid = $("#productGrid");
    const shown = list.slice(0, state.visibleCount);
    $("#resultCount").textContent = list.length ? `Showing ${shown.length} of ${list.length} gifts` : "No gifts found";
    $("#loadMoreBtn").style.display = shown.length < list.length ? "inline-flex" : "none";

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state">
      <strong>No gifts match yet</strong>
      Try widening your filters, or tell our AI Gift Finder what you need.
      <div style="margin-top:14px;"><button class="btn btn-primary btn-sm" id="emptyFinderBtn">Ask AI Gift Finder</button></div>
    </div>`;
      const btn = $("#emptyFinderBtn");
      if (btn) btn.addEventListener("click", () => $("#finderPanel").classList.add("open"));
      return;
    }
    grid.innerHTML = shown.map(productCard).join("");

    $$("[data-add]", grid).forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.add;
        addToCart(id, 1);
        fireShutter(btn.closest(".product-card"));
        const card = btn.closest(".product-card");
        card.style.transform = "scale(.97)";
        setTimeout(() => card.style.transform = "", 150);
      });
    });
    $$("[data-wish]", grid).forEach(btn => {
      btn.addEventListener("click", () => {
        toggleWishlist(btn.dataset.wish);
        btn.classList.toggle("active");
        btn.textContent = btn.classList.contains("active") ? "❤" : "♡";
      });
    });
  }

  $("#loadMoreBtn").addEventListener("click", () => {
    state.visibleCount += 8;
    renderProductGrid();
  });

  /* ---------------------------------------------------------
     CART / WISHLIST LOGIC
  --------------------------------------------------------- */
  function findProduct(id) { return PRODUCTS.find(p => p.id === id); }

  function addToCart(id, qty, customLabel) {
    const existing = state.cart.find(l => l.id === id && !customLabel);
    if (existing && !customLabel) {
      existing.qty += qty;
    } else {
      const p = findProduct(id) || { id, name: customLabel || "Custom Design", price: parseInt($("#studioPrice")?.textContent.replace(/[^\d]/g, "") || 399, 10), icon: "🎁", bg: "var(--cp-cloud)" };
      state.cart.push({ id: customLabel ? id + "-" + Date.now() : id, baseId: id, name: customLabel || p.name, price: p.price, icon: p.icon, bg: p.bg, qty: qty });
    }
    saveState();
    renderCart();
    updateBadges();
  }
  function toggleWishlist(id) {
    const idx = state.wishlist.indexOf(id);
    if (idx > -1) state.wishlist.splice(idx, 1); else state.wishlist.push(id);
    saveState();
    updateBadges();
  }
  function updateBadges() {
    const cartCount = state.cart.reduce((s, l) => s + l.qty, 0);
    $("#cartBadge").textContent = cartCount;
    $("#wishlistBadge").textContent = state.wishlist.length;
    // sync floating dock cart badge
    const floatBadge = $("#cartFloatingBadge");
    if (floatBadge) floatBadge.textContent = cartCount;
    bounceBadge($("#cartBadge"));
    if (floatBadge && cartCount > 0) bounceBadge(floatBadge);
  }

  function renderCart() {
    const wrap = $("#cartItems");
    const totalsWrap = $("#cartTotals");
    if (!state.cart.length) {
      wrap.innerHTML = `<div class="cart-empty"><span>🛍</span>Your cart is empty.<br>Time to give a pic and get a gift!</div>`;
      totalsWrap.style.display = "none";
      return;
    }
    totalsWrap.style.display = "block";
    wrap.innerHTML = state.cart.map(l => `
    <div class="cart-line" data-line="${l.id}">
      <div class="cart-line-media" style="background:${l.bg || 'var(--cp-cloud)'};">${l.icon || "🎁"}</div>
      <div class="cart-line-info">
        <h5>${l.name}</h5>
        <div class="qty-stepper">
          <button data-dec="${l.id}">–</button>
          <span>${l.qty}</span>
          <button data-inc="${l.id}">+</button>
        </div>
        <div class="cart-line-remove" data-remove="${l.id}">Remove</div>
      </div>
      <div class="cart-line-price">${money(l.price * l.qty)}</div>
    </div>
  `).join("");

    $$("[data-inc]", wrap).forEach(b => b.addEventListener("click", () => {
      const line = state.cart.find(l => l.id === b.dataset.inc); line.qty++; saveState(); renderCart(); updateBadges();
    }));
    $$("[data-dec]", wrap).forEach(b => b.addEventListener("click", () => {
      const line = state.cart.find(l => l.id === b.dataset.dec); line.qty--;
      if (line.qty <= 0) state.cart = state.cart.filter(l => l.id !== b.dataset.dec);
      saveState(); renderCart(); updateBadges();
    }));
    $$("[data-remove]", wrap).forEach(b => b.addEventListener("click", () => {
      state.cart = state.cart.filter(l => l.id !== b.dataset.remove);
      saveState(); renderCart(); updateBadges();
    }));

    const subtotal = state.cart.reduce((s, l) => s + l.price * l.qty, 0);
    const delivery = subtotal > 0 ? 49 : 0;
    $("#cartSubtotal").textContent = money(subtotal);
    $("#cartDelivery").textContent = money(delivery);
    $("#cartTotal").textContent = money(subtotal + delivery);
  }

  /* cart drawer open/close */
  const cartDrawer = $("#cartDrawer"), cartOverlay = $("#cartOverlay");
  function openCart() { cartDrawer.classList.add("open"); cartOverlay.classList.add("open"); }
  function closeCart() { cartDrawer.classList.remove("open"); cartOverlay.classList.remove("open"); }
  $("#cartIconBtn").addEventListener("click", openCart);
  $("#cartCloseBtn").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  /* Floating cart FAB */
  const cartFloatingBtn = $("#cartFloatingBtn");
  if (cartFloatingBtn) cartFloatingBtn.addEventListener("click", openCart);

  /* Scroll to top FAB */
  const backToTopBtn = $("#backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  $("#wishlistIconBtn").addEventListener("click", () => {
    alert("Wishlist: " + (state.wishlist.length ? state.wishlist.map(id => findProduct(id)?.name).join(", ") : "no items saved yet."));
  });

  /* WhatsApp checkout */
  $("#whatsappCheckoutBtn").addEventListener("click", () => {
    if (!state.cart.length) return;
    const name = $("#custName").value.trim();
    const phone = $("#custPhone").value.trim();
    const address = $("#custAddress").value.trim();
    if (!name || !phone || !address) {
      alert("Please fill in your name, phone number and address so we can deliver your order.");
      return;
    }
    const orderId = "CP" + Date.now().toString().slice(-6);
    const subtotal = state.cart.reduce((s, l) => s + l.price * l.qty, 0);
    const delivery = 49;
    let msg = `Hi Click Pic! I'd like to place an order (Order ID: ${orderId})%0A%0A`;
    state.cart.forEach(l => {
      msg += `• ${l.name} x${l.qty} — ${money(l.price * l.qty)}%0A`;
    });
    msg += `%0ASubtotal: ${money(subtotal)}%0ADelivery: ${money(delivery)}%0ATotal: ${money(subtotal + delivery)}%0A%0A`;
    msg += `Name: ${name}%0APhone: ${phone}%0AAddress: ${address}`;

    fireShutter($("#cartBody"));
    setTimeout(() => {
      $("#cartBody").innerHTML = `
      <div class="order-confirm">
        <div class="oc-ring">📸</div>
        <h3>Order sent!</h3>
        <p style="color:#6a6989;font-size:13.5px;">We've opened WhatsApp with your itemised order — hit send there to confirm with our team.</p>
        <div class="oid">Order ID: ${orderId}</div>
        <div class="oc-actions">
          <a class="btn btn-lime" href="https://wa.me/918608601757?text=${msg}" target="_blank" rel="noopener">💬 Open WhatsApp to Confirm</a>
          <button class="btn btn-outline btn-sm" id="downloadSummaryBtn">⬇ Save Order Summary</button>
          <button class="btn btn-ghost btn-sm" id="continueShoppingBtn">Continue shopping</button>
        </div>
      </div>`;
      $("#downloadSummaryBtn").addEventListener("click", () => {
        const lines = [`Click Pic — Order ${orderId}`, ""];
        state.cart.forEach(l => lines.push(`${l.name} x${l.qty} — ${money(l.price * l.qty)}`));
        lines.push("", `Subtotal: ${money(subtotal)}`, `Delivery: ${money(delivery)}`, `Total: ${money(subtotal + delivery)}`, "", `Name: ${name}`, `Phone: ${phone}`, `Address: ${address}`);
        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `ClickPic-Order-${orderId}.txt`;
        a.click();
      });
      $("#continueShoppingBtn").addEventListener("click", () => {
        state.cart = [];
        saveState();
        updateBadges();
        closeCart();
        setTimeout(renderCart, 350);
      });
    }, 350);
  });

  /* ---------------------------------------------------------
     DESIGN STUDIO
  --------------------------------------------------------- */
  const studioState = { shape: "mugs", photo: null, zoom: 100, rotate: 0, text: "", color: "#ffffff", history: [] };

  function renderStudioShapes() {
    const wrap = $("#studioShapes");
    wrap.innerHTML = CATEGORIES.slice(0, 8).map(c => `
    <div class="shape-opt ${c.id === "mugs" ? "selected" : ""}" data-shape="${c.id}">
      <span class="so-ic">${c.icon}</span>${c.name}
    </div>`).join("");
    $$(".shape-opt", wrap).forEach(opt => {
      opt.addEventListener("click", () => {
        $$(".shape-opt", wrap).forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        studioState.shape = opt.dataset.shape;
        const prod = PRODUCTS.find(p => p.category === studioState.shape);
        $("#studioPrice").textContent = money(prod ? prod.price : 399);
        setStudioStep(1);
      });
    });
  }

  function setStudioStep(n) {
    $$(".studio-step").forEach((s, i) => s.classList.toggle("active", i <= n));
  }

  const canvasFrame = $("#canvasFrame");
  const photoUpload = $("#photoUpload");
  const uploadHint = $("#uploadHint");

  function loadPhotoIntoCanvas(src) {
    studioState.history.push(src);
    uploadHint.style.display = "none";
    canvasFrame.classList.add("has-photo");
    let img = $("#userPhoto");
    if (!img) {
      img = document.createElement("img");
      img.id = "userPhoto";
      canvasFrame.appendChild(img);
      makeDraggable(img);
    }
    img.src = src;
    img.style.width = "60%";
    img.style.left = "20%";
    img.style.top = "20%";
    img.dataset.x = "0"; img.dataset.y = "0";
    fireShutter($("#canvasFrame").closest(".shutter-wrap"));
    setStudioStep(2);
    updateTextOverlay();
  }

  photoUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => loadPhotoIntoCanvas(reader.result);
    reader.readAsDataURL(file);
  });

  /* drag & drop */
  ["dragover", "dragenter"].forEach(evt => canvasFrame.addEventListener(evt, (e) => { e.preventDefault(); canvasFrame.style.borderColor = "var(--cp-blue)"; }));
  ["dragleave", "drop"].forEach(evt => canvasFrame.addEventListener(evt, (e) => { e.preventDefault(); canvasFrame.style.borderColor = ""; }));
  canvasFrame.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => loadPhotoIntoCanvas(reader.result);
    reader.readAsDataURL(file);
  });

  $("#cameraCapBtn").addEventListener("click", () => {
    photoUpload.setAttribute("capture", "environment");
    photoUpload.click();
  });

  $("#undoBtn").addEventListener("click", () => {
    if (studioState.history.length > 1) {
      studioState.history.pop();
      const prev = studioState.history[studioState.history.length - 1];
      $("#userPhoto").src = prev;
    } else if (studioState.history.length === 1) {
      studioState.history = [];
      const img = $("#userPhoto");
      if (img) img.remove();
      canvasFrame.classList.remove("has-photo");
      uploadHint.style.display = "block";
      setStudioStep(0);
    }
  });

  let compareOriginal = false;
  $("#compareBtn").addEventListener("click", () => {
    const img = $("#userPhoto");
    if (!img) return;
    compareOriginal = !compareOriginal;
    img.style.filter = compareOriginal ? "grayscale(1) opacity(.5)" : "";
  });

  /* drag / pinch on image */
  function makeDraggable(img) {
    let dragging = false, startX = 0, startY = 0, origLeft = 0, origTop = 0;
    img.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      origLeft = parseFloat(img.style.left) || 0;
      origTop = parseFloat(img.style.top) || 0;
      img.setPointerCapture(e.pointerId);
    });
    img.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const rect = canvasFrame.getBoundingClientRect();
      const dx = (e.clientX - startX) / rect.width * 100;
      const dy = (e.clientY - startY) / rect.height * 100;
      img.style.left = (origLeft + dx) + "%";
      img.style.top = (origTop + dy) + "%";
    });
    img.addEventListener("pointerup", () => dragging = false);
    img.addEventListener("pointercancel", () => dragging = false);
  }

  $("#zoomRange").addEventListener("input", (e) => {
    studioState.zoom = e.target.value;
    const img = $("#userPhoto");
    if (img) img.style.width = (60 * (studioState.zoom / 100)) + "%";
  });
  $("#rotateRange").addEventListener("input", (e) => {
    studioState.rotate = e.target.value;
    const img = $("#userPhoto");
    if (img) img.style.transform = `rotate(${studioState.rotate}deg)`;
  });

  $("#overlayText").addEventListener("input", (e) => {
    studioState.text = e.target.value;
    updateTextOverlay();
  });
  $$(".color-dot").forEach(dot => {
    dot.addEventListener("click", () => {
      $$(".color-dot").forEach(d => d.classList.remove("selected"));
      dot.classList.add("selected");
      studioState.color = dot.dataset.c;
      updateTextOverlay();
    });
  });
  function updateTextOverlay() {
    let overlay = $("#textOverlayEl");
    if (!studioState.text) {
      if (overlay) overlay.remove();
      return;
    }
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "textOverlayEl";
      overlay.className = "canvas-text-overlay";
      overlay.style.bottom = "8%";
      overlay.style.left = "50%";
      overlay.style.transform = "translateX(-50%)";
      overlay.style.fontSize = "clamp(14px,4vw,22px)";
      canvasFrame.appendChild(overlay);
    }
    overlay.textContent = studioState.text;
    overlay.style.color = studioState.color;
  }

  $("#studioAddCartBtn").addEventListener("click", () => {
    const prod = PRODUCTS.find(p => p.category === studioState.shape) || PRODUCTS[0];
    const label = `Custom ${prod.categoryName}${studioState.text ? " — \"" + studioState.text + "\"" : ""}`;
    addToCart(prod.id, 1, label);
    setStudioStep(3);
    fireShutter($("#studioShutterRing").parentElement);
    launchConfetti();
  });

  function launchConfetti() {
    const colors = ["#8DC63F", "#ED1C24", "#1EA7E0"];
    for (let i = 0; i < 24; i++) {
      const bit = document.createElement("div");
      bit.style.position = "fixed";
      bit.style.left = (50 + Math.random() * 20 - 10) + "vw";
      bit.style.top = "40vh";
      bit.style.width = "8px"; bit.style.height = "8px";
      bit.style.borderRadius = Math.random() > .5 ? "50%" : "2px";
      bit.style.background = colors[i % colors.length];
      bit.style.zIndex = 500;
      bit.style.pointerEvents = "none";
      document.body.appendChild(bit);
      const dx = (Math.random() - 0.5) * 300, dy = 200 + Math.random() * 300;
      bit.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.4,0,.6,1)" }).onfinish = () => bit.remove();
    }
  }

  /* ---------------------------------------------------------
     REELS
  --------------------------------------------------------- */
  function renderReels() {
    const wrap = $("#reelsScroll");
    wrap.innerHTML = REELS.map((r, i) => `
    <div class="reel-thumb" data-reel="${i}" style="${r.thumb ? '' : 'background:' + r.bg + ';'}">
      ${r.thumb ? `<img src="${r.thumb}" alt="${r.title}" class="reel-thumb-img" loading="lazy">` : ''}
      <div class="reel-thumb-overlay" style="background:${r.thumb ? 'linear-gradient(180deg,transparent 30%,rgba(0,0,0,.75))' : r.bg};"></div>
      <div class="rt-top"><span class="rt-badge">▶ VIDEO</span><span class="rt-views">👁 ${r.views}</span></div>
      <div class="reel-thumb-bottom">
        <div class="reel-thumb-title">${r.title}</div>
        <span class="rt-cta">${r.cta}</span>
      </div>
    </div>`).join("");
    $$(".reel-thumb", wrap).forEach(t => t.addEventListener("click", () => openReel(parseInt(t.dataset.reel, 10))));
  }

  const reelOverlay = $("#reelModalOverlay");
  let reelIndex = 0, reelLikes = {};

  function stopReelVideo() {
    const body = $("#reelBody");
    const iframe = body.querySelector("iframe");
    if (iframe) iframe.remove();
  }

  function openReel(i) {
    stopReelVideo();
    reelIndex = i;
    const r = REELS[i];
    const body = $("#reelBody");
    body.style.background = r.bg;
    if (r.reelId) {
      body.innerHTML = `<iframe
      src="https://www.instagram.com/reel/${r.reelId}/embed"
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
      title="${r.title}"></iframe>`;
    } else if (r.videoId) {
      body.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${r.videoId}?autoplay=1&mute=1&loop=1&playlist=${r.videoId}&controls=0&modestbranding=1&rel=0&playsinline=1"
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
      title="${r.title}"></iframe>`;
    } else {
      body.innerHTML = '<span style="font-size:70px;">🎬</span>';
    }
    $("#reelCtaPill").textContent = r.cta;
    $("#reelMeta").textContent = r.views + " views";
    $("#reelLikeCount").textContent = reelLikes[i] ?? (800 + i * 37);
    $("#reelLikeBtn .heart-icon").textContent = "🤍";
    buildReelProgress();
    reelOverlay.classList.add("open");
  }
  function buildReelProgress() {
    const wrap = $("#reelProgress");
    wrap.innerHTML = REELS.map((_, i) => `<i class="${i < reelIndex ? 'done' : ''} ${i === reelIndex ? 'playing' : ''}"><b></b></i>`).join("");
  }
  function closeReel() {
    stopReelVideo();
    reelOverlay.classList.remove("open");
  }
  $("#reelCloseBtn").addEventListener("click", closeReel);
  reelOverlay.addEventListener("click", (e) => { if (e.target === reelOverlay) closeReel(); });
  $("#reelLikeBtn").addEventListener("click", () => {
    const heartIcon = $("#reelLikeBtn .heart-icon");
    const liked = heartIcon.textContent === "❤";
    heartIcon.textContent = liked ? "🤍" : "❤";
    const base = 800 + reelIndex * 37;
    reelLikes[reelIndex] = liked ? base : base + 1;
    $("#reelLikeCount").textContent = reelLikes[reelIndex];
  });
  $("#reelMuteBtn").addEventListener("click", (e) => {
    const btn = e.currentTarget;
    const muted = btn.querySelector("small")?.textContent === "Mute";
    btn.innerHTML = muted ? "🔇<small>Unmute</small>" : "🔊<small>Mute</small>";
    const iframe = $("#reelBody iframe");
    if (iframe) {
      // Toggle mute by modifying the iframe src
      const src = iframe.src;
      iframe.src = muted ? src.replace("mute=1", "mute=0") : src.replace("mute=0", "mute=1");
    }
  });
  $("#reelShareBtn").addEventListener("click", () => {
    const r = REELS[reelIndex];
    const url = r.videoId ? `https://youtu.be/${r.videoId}` : window.location.href;
    if (navigator.share) { navigator.share({ title: r.title, url }); }
    else { navigator.clipboard?.writeText(url); alert("Link copied!"); }
  });
  /* ---------------------------------------------------------
     CAROUSEL MANAGER
     Provides manual left/right and auto-scroll for any
     horizontal-scroll rail.
  --------------------------------------------------------- */
  function initCarousel(scrollId, prevId, nextId, autoDelayMs) {
    const rail = $(scrollId);
    const prevBtn = $(prevId);
    const nextBtn = $(nextId);
    if (!rail) return;

    function getScrollAmount() {
      const firstChild = rail.firstElementChild;
      return firstChild ? firstChild.offsetWidth + parseInt(getComputedStyle(rail).gap || 16) : 260;
    }

    function scrollTo(dir) {
      const amount = getScrollAmount();
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      const newPos = rail.scrollLeft + dir * amount;
      // Loop around
      if (dir > 0 && rail.scrollLeft >= maxScroll - 2) {
        rail.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir < 0 && rail.scrollLeft <= 2) {
        rail.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        rail.scrollTo({ left: newPos, behavior: "smooth" });
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); scrollTo(-1); });
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); scrollTo(1); });

    // Auto-play
    if (!autoDelayMs) return;
    let autoTimer;
    function startAuto() { autoTimer = setInterval(() => scrollTo(1), autoDelayMs); }
    function stopAuto() { clearInterval(autoTimer); }

    startAuto();
    rail.addEventListener("mouseenter", stopAuto);
    rail.addEventListener("mouseleave", startAuto);
    rail.addEventListener("touchstart", stopAuto, { passive: true });
    rail.addEventListener("touchend", () => { stopAuto(); setTimeout(startAuto, 1500); }, { passive: true });
  }

  document.addEventListener("keydown", (e) => {
    if (!reelOverlay.classList.contains("open")) return;
    if (e.key === "ArrowRight") openReel((reelIndex + 1) % REELS.length);
    if (e.key === "ArrowLeft") openReel((reelIndex - 1 + REELS.length) % REELS.length);
    if (e.key === "Escape") closeReel();
  });
  $("#reelModal").addEventListener("click", (e) => {
    if (e.target.closest("button") || e.target.tagName === "IFRAME") return;
    const rect = $("#reelModal").getBoundingClientRect();
    const half = rect.left + rect.width / 2;
    if (e.clientX > half) openReel((reelIndex + 1) % REELS.length);
    else openReel((reelIndex - 1 + REELS.length) % REELS.length);
  });

  const instaOverlay = $("#instaModalOverlay");
  let instaIndex = 0;

  function renderInstaWall() {
    const wrap = $("#instaGrid");
    wrap.innerHTML = INSTA_POSTS.map((p, i) => `
    <div class="ig-tile" style="${p.img ? '' : 'background:' + p.bg + ';'}" data-ig="${i}">
      ${p.img ? `<img src="${p.img}" alt="${p.caption}" class="ig-tile-img" loading="lazy">` : ''}
      ${p.isVideo ? '<span class="ig-play">▶</span>' : ''}
      <div class="ig-overlay"></div>
      <div class="ig-cap">${p.caption}</div>
      <div class="ig-likes">♥ ${p.likes || ''}</div>
    </div>`).join("");
    $$(".ig-tile", wrap).forEach(t => t.addEventListener("click", () => openInsta(parseInt(t.dataset.ig, 10))));
  }
  function stopInstaVideo() {
    const media = $("#instaModalMedia");
    const iframe = media.querySelector("iframe");
    if (iframe) iframe.remove();
  }

  function openInsta(i) {
    stopInstaVideo();
    instaIndex = i;
    const p = INSTA_POSTS[i];
    const mediaDom = $("#instaModalMedia");
    mediaDom.style.background = p.bg;
    if (p.isVideo && p.reelId) {
      mediaDom.innerHTML = `<iframe
      src="https://www.instagram.com/reel/${p.reelId}/embed"
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
      title="${p.caption}"></iframe>`;
    } else if (p.isVideo && p.videoId) {
      mediaDom.innerHTML = `<iframe
      src="https://www.youtube.com/embed/${p.videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1"
      frameborder="0" allow="autoplay; encrypted-media" allowfullscreen
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
      title="${p.caption}"></iframe>`;
    } else if (p.img) {
      mediaDom.innerHTML = `<img src="${p.img}" alt="${p.caption}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">`;
    } else {
      mediaDom.innerHTML = `<span style="font-size:64px;">${p.emoji}</span>`;
    }
    $("#instaModalCaption").textContent = p.caption;
    $("#instaModalTags").textContent = p.tags;
    $("#instaModalDate").textContent = p.date;
    const likesEl = $("#instaModalLikes");
    if (likesEl) likesEl.textContent = (p.likes || "") + " likes";
    // Reset heart
    const heartIcon = $("#instaModalLikeBtn .im-heart");
    if (heartIcon) heartIcon.textContent = instaLiked.has(i) ? "\u2764" : "\ud83e\udd0d";
    instaOverlay.classList.add("open");
    fireShutter(instaOverlay);
  }
  function closeInsta() {
    stopInstaVideo();
    instaOverlay.classList.remove("open");
  }
  function navInsta(dir) {
    openInsta((instaIndex + dir + INSTA_POSTS.length) % INSTA_POSTS.length);
  }
  const instaLiked = new Set();
  $("#instaCloseBtn").addEventListener("click", closeInsta);
  instaOverlay.addEventListener("click", (e) => { if (e.target === instaOverlay) closeInsta(); });
  document.addEventListener("click", (e) => {
    if (e.target.closest("#instaNavPrev")) navInsta(-1);
    if (e.target.closest("#instaNavNext")) navInsta(1);
    if (e.target.closest("#instaModalLikeBtn")) {
      const icon = $("#instaModalLikeBtn .im-heart");
      if (!icon) return;
      const liked = instaLiked.has(instaIndex);
      if (liked) { instaLiked.delete(instaIndex); icon.textContent = "\ud83e\udd0d"; }
      else { instaLiked.add(instaIndex); icon.textContent = "\u2764"; }
      $("#instaModalLikeBtn").classList.toggle("liked", !liked);
    }
    if (e.target.closest("#instaModalShareBtn")) {
      const p = INSTA_POSTS[instaIndex];
      if (navigator.share) { navigator.share({ title: p.caption, text: p.tags, url: window.location.href }); }
      else { navigator.clipboard?.writeText(window.location.href); alert("Link copied!"); }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (!instaOverlay.classList.contains("open")) return;
    if (e.key === "ArrowRight") navInsta(1);
    if (e.key === "ArrowLeft") navInsta(-1);
    if (e.key === "Escape") closeInsta();
  });

  /* ---------------------------------------------------------
     TESTIMONIALS
  --------------------------------------------------------- */
  function renderTestimonials() {
    const wrap = $("#testiScroll");
    wrap.innerHTML = TESTIMONIALS.map(t => `
    <div class="testi-card" lang="en">
      <div class="testi-top">
        <div class="testi-avatar">${t.name[0]}</div>
        <div><strong>${t.name}</strong><span>${t.loc}</span></div>
      </div>
      <div class="stars">★★★★★</div>
      <p>${t.en}</p>
    </div>
    <div class="testi-card" lang="ta">
      <div class="testi-top">
        <div class="testi-avatar">${t.name[0]}</div>
        <div><strong>${t.name}</strong><span>${t.loc}</span></div>
      </div>
      <div class="stars">★★★★★</div>
      <p>${t.ta}</p>
    </div>
  `).join("");
  }
  $$(".lang-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".lang-toggle button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      document.body.classList.toggle("lang-ta", btn.dataset.lang === "ta");
      // Reset carousel scroll when switching language
      const rail = $("#testiScroll");
      if (rail) rail.scrollTo({ left: 0, behavior: "smooth" });
    });
  });

  /* ---------------------------------------------------------
     AI GIFT FINDER
  --------------------------------------------------------- */
  const finderPanel = $("#finderPanel");
  $("#finderLauncher").addEventListener("click", () => finderPanel.classList.toggle("open"));
  let finderAnswers = {};
  $$('.finder-opts [data-occasion]').forEach(btn => {
    btn.addEventListener("click", () => {
      finderAnswers.occasion = btn.dataset.occasion;
      showFinderQ(2);
    });
  });
  $$('.finder-opts [data-budget]').forEach(btn => {
    btn.addEventListener("click", () => {
      finderAnswers.budget = parseInt(btn.dataset.budget, 10);
      const matches = PRODUCTS.filter(p => p.occasion === finderAnswers.occasion && p.price <= finderAnswers.budget)
        .sort((a, b) => b.rating - a.rating).slice(0, 3);
      const finalList = matches.length ? matches : PRODUCTS.filter(p => p.price <= finderAnswers.budget).slice(0, 3);
      $("#finderResult").innerHTML = finalList.map(p => `
      <div class="fr-item">
        <div class="fr-ic">${p.icon}</div>
        <div style="flex:1;">${p.name}<br><strong style="font-family:var(--ff-mono);color:var(--cp-red);">${money(p.price)}</strong></div>
        <button class="btn btn-sm btn-primary" data-finder-add="${p.id}">Add</button>
      </div>`).join("");
      $$('[data-finder-add]').forEach(b => b.addEventListener("click", () => { addToCart(b.dataset.finderAdd, 1); fireShutter(b); }));
      showFinderQ(3);
    });
  });
  function showFinderQ(n) {
    $$(".finder-q").forEach(q => q.classList.toggle("active", q.dataset.q == String(n)));
  }
  $("#finderRestartBtn").addEventListener("click", () => { finderAnswers = {}; showFinderQ(1); });

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  function init() {
    renderCategoryGrid();
    renderOccasionStrip();
    renderFilterOptions();
    renderProductGrid();
    renderStudioShapes();
    renderReels();
    renderInstaWall();
    renderTestimonials();
    renderCart();
    updateBadges();

    /* init carousels after content rendered */
    initCarousel("#reelsScroll",  "#reelsPrev",  "#reelsNext",  4000);
    initCarousel("#instaGrid",    "#instaPrev",  "#instaNext",  3500);
    initCarousel("#testiScroll", "#testiPrev",  "#testiNext",  5000);
    $("#priceMaxDisplay").value = money(state.maxPrice);

    $("#searchInput").addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const grid = $("#productGrid");
      if (!q) { renderProductGrid(); return; }
      const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
      grid.innerHTML = results.length ? results.slice(0, 20).map(productCard).join("") :
        `<div class="empty-state"><strong>No matches for "${e.target.value}"</strong>Try a different search, or browse categories above.</div>`;
      $$("[data-add]", grid).forEach(btn => btn.addEventListener("click", () => { addToCart(btn.dataset.add, 1); fireShutter(btn.closest(".product-card")); }));
      $$("[data-wish]", grid).forEach(btn => btn.addEventListener("click", () => { toggleWishlist(btn.dataset.wish); btn.classList.toggle("active"); btn.textContent = btn.classList.contains("active") ? "❤" : "♡"; }));
      $("#resultCount").textContent = `${results.length} results for "${e.target.value}"`;
    });

    $$(".hero-ctas a, .btn").forEach(() => { }); // no-op safety

    document.querySelectorAll(".section-head, .trust-item, .testi-card").forEach(observeReveal);
  }
  document.addEventListener("DOMContentLoaded", init);

})();
