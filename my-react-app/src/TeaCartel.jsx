import { useState, useEffect, useRef } from "react";

/* ─── Google Fonts via @import in a style tag ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #FAF6EE;
      color: #1A1209;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    ul { list-style: none; }

    @keyframes steamRing {
      0%, 100% { transform: translateY(0) scale(1); opacity: 0.06; }
      50% { transform: translateY(-20px) scale(1.1); opacity: 0.12; }
    }
    @keyframes scrollPulse {
      0%, 100% { transform: scaleY(1); opacity: 1; }
      50% { transform: scaleY(0.6); opacity: 0.4; }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s ease, transform 0.65s ease;
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal.d1 { transition-delay: 0.10s; }
    .reveal.d2 { transition-delay: 0.20s; }
    .reveal.d3 { transition-delay: 0.30s; }

    @media (prefers-reduced-motion: reduce) {
      .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
    }
  `}</style>
);

/* ─── TOKENS ─── */
const T = {
  ink:       "#1A1209",
  cream:     "#FAF6EE",
  amber:     "#C8873A",
  amberL:    "#E8A85A",
  sage:      "#5C6B52",
  warmWhite: "#FFF9F1",
  muted:     "#7A6B55",
  cardBg:    "#FFF4E6",
  border:    "#E8DDD0",
  display:   "'Playfair Display', Georgia, serif",
  serif:     "'DM Serif Display', Georgia, serif",
  body:      "'DM Sans', system-ui, sans-serif",
};

/* ─── REVEAL HOOK ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("reveal");
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── SMALL COMPONENTS ─── */
const Eyebrow = ({ children, light }) => (
  <span style={{
    fontFamily: T.body, fontSize: 11, fontWeight: 500,
    letterSpacing: "0.18em", textTransform: "uppercase",
    color: light ? T.amberL : T.amber, display: "block", marginBottom: 12,
  }}>{children}</span>
);

const Divider = ({ center }) => (
  <div style={{ width: 48, height: 2, background: T.amber, margin: center ? "16px auto" : "20px 0" }} />
);

const Btn = ({ children, href, variant = "primary", style: s, onClick, target, rel }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "13px 26px", borderRadius: 100, cursor: "pointer",
    fontFamily: T.body, fontSize: 14, fontWeight: 500, letterSpacing: "0.03em",
    border: "none", textDecoration: "none", transition: "transform 0.18s, box-shadow 0.18s",
    ...s,
  };
  const variants = {
    primary:      { background: T.amber, color: "#fff" },
    outline:      { background: "transparent", border: `1.5px solid ${T.ink}`, color: T.ink },
    outlineLight: { background: "transparent", border: "1.5px solid rgba(255,255,255,0.45)", color: "#fff" },
    ghost:        { background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" },
    white:        { background: "rgba(255,255,255,0.18)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" },
  };
  const combined = { ...base, ...variants[variant] };
  const [hovered, setHovered] = useState(false);
  const hoverStyle = hovered ? { transform: "translateY(-2px)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" } : {};
  if (href) return (
    <a href={href} target={target} rel={rel}
      style={{ ...combined, ...hoverStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {children}
    </a>
  );
  return (
    <button onClick={onClick} style={{ ...combined, ...hoverStyle }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {children}
    </button>
  );
};

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "18px clamp(20px,5vw,48px)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    transition: "background 0.3s, box-shadow 0.3s",
    background: scrolled ? "rgba(250,246,238,0.96)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    boxShadow: scrolled ? `0 1px 0 ${T.border}` : "none",
  };

  const logoStyle = {
    fontFamily: T.display, fontSize: 22, fontWeight: 900,
    color: scrolled ? T.ink : "#fff",
    letterSpacing: "-0.01em", transition: "color 0.3s",
  };

  const linkStyle = {
    fontSize: 14, fontWeight: 500,
    color: scrolled ? T.muted : "rgba(255,255,255,0.85)",
    transition: "color 0.2s",
  };

  return (
    <nav style={navStyle}>
      <a href="#home" style={logoStyle}>Tea Cartel</a>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["About","Menu","Reviews","Find Us"].map((l, i) => (
          <a key={l} href={`#${["about","menu","reviews","visit"][i]}`} style={linkStyle}>{l}</a>
        ))}
        <Btn href="#order" style={{ padding: "10px 20px", fontSize: 13 }}>Order Now</Btn>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero() {
  return (
    <section id="home" style={{
      minHeight: "100svh",
      background: "linear-gradient(160deg,#1A1209 0%,#2C1A08 40%,#3D2510 100%)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", textAlign: "center",
      padding: "120px clamp(20px,5vw,48px) 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 80%,rgba(200,135,58,0.18) 0%,transparent 70%)",
      }}/>
      {/* Steam rings */}
      {[{w:120,h:120,t:"15%",r:"12%",d:"0s"},{w:80,h:80,t:"20%",r:"18%",d:"2s"},{w:50,h:50,t:"25%",r:"14%",d:"4s"}].map((r,i)=>(
        <div key={i} style={{
          position:"absolute", top:r.t, right:r.r, width:r.w, height:r.h,
          borderRadius:"50%", border:`2px solid ${T.amber}`, opacity:0.07,
          animation:`steamRing 6s ease-in-out ${r.d} infinite`,
        }}/>
      ))}

      {/* Eyebrow */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, position:"relative" }}>
        <div style={{ width:32, height:1, background: T.amberL, opacity:0.5 }}/>
        <span style={{ fontFamily:T.body, fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:T.amberL, fontWeight:500 }}>
          Jaipur's Favourite Hangout
        </span>
        <div style={{ width:32, height:1, background: T.amberL, opacity:0.5 }}/>
      </div>

      {/* Headline */}
      <h1 style={{ fontFamily:T.display, fontSize:"clamp(54px,10vw,108px)", fontWeight:900, lineHeight:0.95, letterSpacing:"-0.03em", color:"#FFF9F1", marginBottom:12 }}>
        Tea<br/><em style={{ fontStyle:"italic", color:T.amberL }}>Cartel</em>
      </h1>
      <p style={{ fontFamily:T.serif, fontStyle:"italic", fontSize:"clamp(18px,3vw,26px)", color:"rgba(255,249,241,0.55)", marginBottom:24, letterSpacing:"0.04em" }}>
        Sip. Chill. Repeat.
      </p>
      <p style={{ maxWidth:520, fontSize:"clamp(15px,2vw,17px)", color:"rgba(255,249,241,0.62)", lineHeight:1.75, marginBottom:40 }}>
        A cozy café in Jaipur serving handcrafted teas, delicious bites,
        and a space where great conversations come naturally.
      </p>

      {/* CTAs */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center" }}>
        <Btn href="#menu" variant="primary">☕ View Menu</Btn>
        <Btn href="https://www.zomato.com/jaipur/tea-cartel-jagatpura" target="_blank" rel="noopener" variant="ghost">🍽️ Order on Zomato</Btn>
        <Btn href="https://www.swiggy.com/restaurants/1157814/dineout/menu" target="_blank" rel="noopener" variant="ghost">🛵 Order on Swiggy</Btn>
        <Btn href="https://www.instagram.com/_tea_cartel/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener" variant="outlineLight">📸 Instagram</Btn>
      </div>

      {/* Scroll cue */}
      <div style={{ position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, color:"rgba(255,255,255,0.28)", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase" }}>
        <div style={{ width:1, height:40, background:`linear-gradient(to bottom,${T.amber},transparent)`, animation:"scrollPulse 2s ease-in-out infinite" }}/>
        Scroll
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   TRUST BAR
══════════════════════════════════════════ */
function TrustBar() {
  const items = [
    { icon:"⭐", text:"4.5+ on Zomato" },
    { icon:"🏡", text:"Open-Air Ambience" },
    { icon:"🌿", text:"Freshly Made Daily" },
    { icon:"📍", text:"Jagatpura, Jaipur" },
    { icon:"🕙", text:"Open 10 AM – Midnight" },
  ];
  return (
    <div style={{ background:T.warmWhite, borderBottom:`1px solid ${T.border}`, padding:"18px 0" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)", display:"flex", flexWrap:"wrap", justifyContent:"center", gap:32 }}>
        {items.map(item => (
          <div key={item.text} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, fontWeight:500, color:T.muted }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>{item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
const features = [
  { icon:"🌿", title:"Open-Air Ambience", desc:"Escape the crowded indoors and breathe easy in our refreshing open space." },
  { icon:"☕", title:"Handcrafted Brews & Great Food", desc:"Every item prepared fresh — to bring people together over great taste." },
  { icon:"📸", title:"Aesthetic & Relaxed Vibes", desc:"Cozy seating, natural surroundings, and the perfect Instagram backdrop." },
  { icon:"❤️", title:"Where People Connect", desc:"Good food, great company, and lasting memories — all in one place." },
];

function About() {
  const r1 = useReveal(), r2 = useReveal();
  return (
    <section id="about" style={{ padding:"clamp(64px,10vw,120px) 0" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"clamp(40px,6vw,80px)", alignItems:"center" }}>

          {/* Visual */}
          <div ref={r1} style={{ position:"relative" }}>
            <div style={{ borderRadius:24, overflow:"hidden", aspectRatio:"4/5", background:"linear-gradient(135deg,#2C1A08,#3D2510)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ textAlign:"center", color:"rgba(200,135,58,0.3)", padding:40 }}>
                <div style={{ fontSize:80, marginBottom:16 }}>☕</div>
                <p style={{ fontSize:13, lineHeight:1.6 }}>Replace with your<br/>best café atmosphere photo</p>
              </div>
            </div>
            <div style={{
              position:"absolute", bottom:-20, right:-20, width:110, height:110,
              background:T.amber, borderRadius:"50%", display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", boxShadow:"0 8px 32px rgba(200,135,58,0.35)",
            }}>
              <div style={{ fontFamily:T.display, fontSize:24, fontWeight:900, color:"#fff", lineHeight:1 }}>✦</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.8)", textAlign:"center", lineHeight:1.3, marginTop:4 }}>Jaipur's<br/>Favourite</div>
            </div>
          </div>

          {/* Text */}
          <div ref={r2} className="d1">
            <Eyebrow>Our Story</Eyebrow>
            <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>
              Where every cup starts a conversation.
            </h2>
            <Divider/>
            <p style={{ fontSize:"clamp(15px,2vw,18px)", color:T.muted, lineHeight:1.8, marginBottom:16 }}>
              At Tea Cartel, we believe great conversations begin with a great cup of tea.
              What started as a simple idea — to create a warm, welcoming space for people
              to connect and relax — has grown into one of Jaipur's favourite hangout spots.
            </p>
            <p style={{ fontSize:"clamp(15px,2vw,18px)", color:T.muted, lineHeight:1.8, marginBottom:32 }}>
              Whether you're meeting friends, catching up on work, or simply taking a break,
              Tea Cartel offers the perfect blend of comfort, flavour, and atmosphere.
              More than just a café — it's where memories are made.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {features.map(f => (
                <div key={f.title} style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
                  <div style={{ width:44, height:44, background:T.cardBg, border:`1px solid ${T.border}`, borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 style={{ fontWeight:600, fontSize:15, marginBottom:2 }}>{f.title}</h4>
                    <p style={{ fontSize:13, color:T.muted, lineHeight:1.5 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   MENU
══════════════════════════════════════════ */
const menuItems = [
  { cat:"drinks", featured:true, icon:"🧊", tag:"Signature Drink", name:"Cold Coffee", desc:"Rich, creamy and deeply satisfying — our cold coffee is what legends are made of. Add extra ice for ₹20.", price:"₹110 – ₹180", badge:"⭐ Fan Favourite" },
  { cat:"tea",    icon:"🏺", tag:"Hot Tea",   name:"Kulhad Chai",       desc:"Served in an earthen kulhad — warm, aromatic, and authentically desi. A timeless classic.",                          price:"₹35" },
  { cat:"tea",    icon:"🌱", tag:"Hot Tea",   name:"Tulsi Adrak Chai",  desc:"The healing brew — fresh tulsi and ginger blended into a soothing cup that warms the soul.",                         price:"₹25" },
  { cat:"burger", icon:"🍔", tag:"Burgers",   name:"Special Burger",    desc:"Our chef's signature creation — loaded with layers of flavour that make it anything but ordinary.",                  price:"₹160" },
  { cat:"tea",    icon:"☕", tag:"Hot Coffee", name:"Cappuccino",        desc:"Perfectly frothed, smooth, and indulgent. The café classic that never disappoints.",                                  price:"₹99" },
  { cat:"momos",  icon:"🥟", tag:"Momos",     name:"Veg Tandoori Momos",desc:"Smoky, spiced, and absolutely addictive — our tandoori momos are a crowd-puller every single time.",               price:"₹240", sub:"8 pcs" },
  { cat:"chinese",icon:"🍜", tag:"Chinese",   name:"Paneer Chowmeen",   desc:"Wok-tossed noodles with soft paneer cubes, fresh veggies, and bold Indo-Chinese flavours.",                         price:"₹190" },
  { cat:"soup",   icon:"🍲", tag:"Soups",     name:"Manchow Soup",      desc:"A deeply satisfying, tangy and spicy broth topped with crispy noodles. Perfect for cool evenings.",                 price:"₹99" },
  { cat:"burger", icon:"🧀", tag:"Burgers",   name:"Cheese Burger",     desc:"Melty cheese, crispy patty, fresh greens — simple pleasures done perfectly right.",                                  price:"₹110" },
];

const tabs = [
  { key:"all", label:"All" },
  { key:"tea", label:"Hot Tea" },
  { key:"drinks", label:"Cold Drinks" },
  { key:"burger", label:"Burgers" },
  { key:"momos", label:"Momos" },
  { key:"chinese", label:"Chinese" },
  { key:"soup", label:"Soups" },
];

function MenuCard({ item }) {
  const [hov, setHov] = useState(false);
  const dark = item.featured;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark ? T.ink : T.warmWhite,
        border: `1px solid ${dark ? T.ink : T.border}`,
        borderRadius: 20, padding: 28, position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 16px 40px rgba(26,18,9,0.09)" : "none",
      }}>
      {item.badge && (
        <div style={{ position:"absolute", top:-12, right:24, background:T.amber, color:"#fff", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"4px 12px", borderRadius:100 }}>
          {item.badge}
        </div>
      )}
      <div style={{ fontSize:36, marginBottom:16 }}>{item.icon}</div>
      <div style={{ display:"inline-block", fontSize:10, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:T.amber, background:"rgba(200,135,58,0.1)", padding:"3px 10px", borderRadius:100, marginBottom:10 }}>
        {item.tag}
      </div>
      <h3 style={{ fontFamily:T.serif, fontSize:22, marginBottom:8, lineHeight:1.2, color: dark ? "#FFF9F1" : T.ink }}>{item.name}</h3>
      <p style={{ fontSize:14, color: dark ? "rgba(255,249,241,0.6)" : T.muted, lineHeight:1.6, marginBottom:16 }}>{item.desc}</p>
      <div style={{ fontFamily:T.display, fontSize:20, fontWeight:700, color: dark ? "#FFF9F1" : T.ink }}>
        {item.price}{item.sub && <span style={{ fontSize:13, fontWeight:400, color: dark ? "rgba(255,249,241,0.5)" : T.muted }}> {item.sub}</span>}
      </div>
    </div>
  );
}

function Menu() {
  const [active, setActive] = useState("all");
  const headerRef = useReveal();
  const filtered = menuItems.filter(m => active === "all" || m.cat === active);

  return (
    <section id="menu" style={{ padding:"clamp(64px,10vw,120px) 0", background:T.cardBg }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div ref={headerRef} style={{ textAlign:"center", maxWidth:600, margin:"0 auto 48px" }}>
          <Eyebrow>What We Serve</Eyebrow>
          <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>
            Made with care.<br/>Served with love.
          </h2>
          <Divider center />
          <p style={{ fontSize:"clamp(15px,2vw,18px)", color:T.muted, lineHeight:1.75 }}>
            From comforting teas to signature bites — every item is designed to delight.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActive(t.key)} style={{
              padding:"10px 22px", borderRadius:100, cursor:"pointer", fontFamily:T.body, fontSize:13, fontWeight:500,
              border: `1.5px solid ${active===t.key ? T.ink : T.border}`,
              background: active===t.key ? T.ink : "transparent",
              color: active===t.key ? T.cream : T.muted,
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
          {filtered.map(item => <MenuCard key={item.name} item={item} />)}
        </div>

        {/* CTA bar */}
        <div style={{ marginTop:48, background:T.warmWhite, border:`1px solid ${T.border}`, borderRadius:20, padding:"28px 36px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
          <div>
            <p style={{ fontSize:17, fontWeight:500 }}>Explore our full menu</p>
            <small style={{ color:T.muted, fontSize:13 }}>Hot teas, cold drinks, burgers, momos, Chinese, soups & more.</small>
          </div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn href="https://www.zomato.com/jaipur/tea-cartel-jagatpura" target="_blank" rel="noopener">Full Menu on Zomato</Btn>
            <Btn href="https://www.swiggy.com/restaurants/1157814/dineout/menu" target="_blank" rel="noopener" variant="outline">View on Swiggy</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   GALLERY
══════════════════════════════════════════ */
const galleryItems = [
  { icon:"🌿", caption:"Open-air ambience at Tea Cartel", hint:"Replace with your outdoor photo",   span:7, ratio:"16/10" },
  { icon:"🧊", caption:"Handcrafted cold coffee",          hint:"Place a drink photo here",          span:5, ratio:"4/5" },
  { icon:"🏺", caption:"Authentic kulhad chai",            hint:"Place a chai photo here",            span:4, ratio:"4/5" },
  { icon:"🥟", caption:"Smoky tandoori momos",             hint:"Place a food photo here",            span:4, ratio:"4/5" },
  { icon:"🌆", caption:"Golden hour at Tea Cartel",        hint:"Place an evening photo here",        span:4, ratio:"4/5" },
];

function Gallery() {
  const ref = useReveal();
  return (
    <section id="gallery" style={{ padding:"clamp(64px,10vw,120px) 0" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ textAlign:"center", maxWidth:600, margin:"0 auto 48px" }}>
          <Eyebrow>Gallery</Eyebrow>
          <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>
            Feel the vibe before you arrive.
          </h2>
          <Divider center/>
          <p style={{ fontSize:"clamp(15px,2vw,18px)", color:T.muted, lineHeight:1.75 }}>
            Open-air seating, cozy corners, and an atmosphere that makes every visit unforgettable.
          </p>
        </div>

        <div ref={ref} style={{ display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:16 }}>
          {galleryItems.map((g, i) => (
            <div key={i} style={{
              gridColumn:`span ${g.span}`, aspectRatio: g.ratio,
              borderRadius:16, overflow:"hidden",
              background:"linear-gradient(135deg,#2C1A08,#3D2510)",
              display:"flex", alignItems:"center", justifyContent:"center",
              position:"relative",
            }}>
              <div style={{ textAlign:"center", color:"rgba(200,135,58,0.3)", padding:20 }}>
                <div style={{ fontSize:40, marginBottom:10 }}>{g.icon}</div>
                <p style={{ fontSize:12, lineHeight:1.5, fontStyle:"italic" }}>{g.hint}</p>
              </div>
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                background:"linear-gradient(to top,rgba(26,18,9,0.85),transparent)",
                padding:"32px 16px 14px", color:"#fff", fontSize:13,
                fontFamily:T.serif, fontStyle:"italic",
              }}>{g.caption}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   REVIEWS
══════════════════════════════════════════ */
const reviews = [
  { stars:5, text:"Hands down the best chai I've had in Jaipur. The kulhad gives it such an authentic feel. The open-air seating is a game-changer — perfect for evenings with friends.", name:"Priya S.", meta:"Zomato Review · Jagatpura", initials:"P", color:T.amber },
  { stars:5, text:"The cold coffee here is unreal — thick, creamy, and properly chilled. We come at least twice a week. The tandoori momos are an absolute must-try!", name:"Rohit M.", meta:"Swiggy Review · Regular Customer", initials:"R", color:T.amberL },
  { stars:5, text:"Tea Cartel is my go-to study spot. Great vibes, amazing cappuccino, and a really relaxed atmosphere. Nobody rushes you out. Feels like a second home.", name:"Aisha K.", meta:"Instagram Review · Student", initials:"A", color:T.sage },
  { stars:5, text:"Came for a date night and we stayed 3 hours. The ambience is beautiful, food is great value, and the service is warm and genuine. Highly recommended!", name:"Vikas & Neha", meta:"Google Review · Jaipur", initials:"V", color:"#CB6030" },
  { stars:4, text:"The burger menu surprised me — the Special Burger is properly loaded. Add a cold coffee and you've got the perfect combo. Great outdoor seating makes it even better.", name:"Shreya T.", meta:"Zomato Review · Food Blogger", initials:"S", color:"#6B7B60" },
  { stars:5, text:"Tulsi Adrak Chai in the morning here is my ritual. The staff is so friendly, portions are generous, and the prices are incredibly reasonable. Pure joy.", name:"Mehak J.", meta:"Instagram DM · Local Resident", initials:"M", color:T.amber },
];

function Reviews() {
  const ref = useReveal();
  return (
    <section id="reviews" style={{ padding:"clamp(64px,10vw,120px) 0", background:T.ink }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:24, marginBottom:48 }}>
          <div>
            <Eyebrow light>What People Say</Eyebrow>
            <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em", color:T.cream }}>
              Loved by Jaipur.<br/>Shared on Instagram.
            </h2>
          </div>
          <div>
            <div style={{ fontFamily:T.display, fontSize:72, fontWeight:900, color:T.cream, lineHeight:1 }}>4.5</div>
            <div style={{ color:T.amberL, fontSize:18, marginTop:4 }}>★★★★½</div>
            <div style={{ fontSize:12, color:"rgba(250,246,238,0.45)", marginTop:4 }}>Average across platforms</div>
          </div>
        </div>

        <div ref={ref} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:24 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:20, padding:32 }}>
              <div style={{ color:T.amberL, fontSize:16, marginBottom:16, letterSpacing:2 }}>{"★".repeat(r.stars)}{"☆".repeat(5-r.stars)}</div>
              <p style={{ fontFamily:T.serif, fontStyle:"italic", fontSize:17, lineHeight:1.65, color:"rgba(250,246,238,0.9)", marginBottom:20 }}>"{r.text}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:"#fff" }}>{r.initials}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:T.cream }}>{r.name}</div>
                  <div style={{ fontSize:12, color:"rgba(250,246,238,0.4)", marginTop:2 }}>{r.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   ORDER ONLINE
══════════════════════════════════════════ */
function Order() {
  const ref = useReveal();
  return (
    <section id="order" style={{ padding:"clamp(64px,10vw,120px) 0" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto 48px" }}>
          <Eyebrow>Order Online</Eyebrow>
          <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>Tea Cartel,<br/>delivered to you.</h2>
          <Divider center/>
          <p style={{ fontSize:"clamp(15px,2vw,17px)", color:T.muted, lineHeight:1.75 }}>
            Can't make it in? We come to you. Order on Zomato or Swiggy and get your favourites delivered fresh.
          </p>
        </div>

        <div ref={ref} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
          {[
            { label:"Zomato", bg:"#CB202D", icon:"🍽️", desc:"Browse our full menu, read reviews, and get fast delivery — all on Zomato.", href:"https://www.zomato.com/jaipur/tea-cartel-jagatpura", cta:"Order on Zomato →" },
            { label:"Swiggy", bg:"#FC8019", icon:"🛵", desc:"Quick delivery straight to your door. Find Tea Cartel on Swiggy right now.", href:"https://www.swiggy.com/restaurants/1157814/dineout/menu", cta:"Order on Swiggy →" },
          ].map(p => {
            const [hov, setHov] = useState(false);
            return (
              <a key={p.label} href={p.href} target="_blank" rel="noopener"
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ background:p.bg, borderRadius:24, padding:40, display:"flex", flexDirection:"column", gap:14, transition:"transform 0.2s", transform:hov?"translateY(-4px)":"none", textDecoration:"none" }}>
                <div style={{ fontSize:36 }}>{p.icon}</div>
                <h3 style={{ fontFamily:T.display, fontSize:28, fontWeight:900, color:"#fff" }}>{p.label}</h3>
                <p style={{ fontSize:14, color:"rgba(255,255,255,0.8)", lineHeight:1.6 }}>{p.desc}</p>
                <span style={{ display:"inline-block", marginTop:8, padding:"12px 22px", borderRadius:100, background:"rgba(255,255,255,0.18)", color:"#fff", border:"1px solid rgba(255,255,255,0.3)", fontSize:14, fontWeight:500, width:"fit-content" }}>{p.cta}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   VISIT
══════════════════════════════════════════ */
function Visit() {
  const r1 = useReveal(), r2 = useReveal();
  return (
    <section id="visit" style={{ padding:"clamp(64px,10vw,120px) 0", background:T.cardBg }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto 56px" }}>
          <Eyebrow>Find Us</Eyebrow>
          <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>Come say hello.</h2>
          <Divider center/>
          <p style={{ fontSize:"clamp(15px,2vw,17px)", color:T.muted, lineHeight:1.75 }}>
            Easy to find in Jagatpura, Jaipur. Look for the cozy open-air café with the best chai in town.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"clamp(40px,6vw,80px)", alignItems:"start" }}>
          <div ref={r1} style={{ borderRadius:24, overflow:"hidden", aspectRatio:"4/3", border:`1px solid ${T.border}` }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3561.6!2d75.83213590673253!3d26.820637246721603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjbCsDQ5JzE0LjMiTiA3NcKwNDknNTcuNyJF!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border:"none", display:"block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tea Cartel Location"/>
          </div>

          <div ref={r2} className="d1" style={{ display:"flex", flexDirection:"column", gap:32 }}>
            {[
              { label:"📍 Address", content: <><p style={{fontSize:16,lineHeight:1.7}}>Tea Cartel<br/>Jagatpura, Jaipur<br/>Rajasthan, India</p><a href="https://maps.google.com/?q=26.820637246721603,75.83213590673253" target="_blank" style={{color:T.amber,fontSize:14,fontWeight:500,display:"inline-block",marginTop:8}}>Get Directions →</a></> },
              { label:"📞 Contact", content: <><a href="tel:+919530383938" style={{fontSize:22,fontWeight:700,fontFamily:T.display,color:T.ink}}>+91 95303 83938</a><p style={{fontSize:13,color:T.muted,marginTop:6}}>Call or WhatsApp for reservations & inquiries</p></> },
              { label:"🕙 Opening Hours", content: <>
                <span style={{display:"inline-block",background:"rgba(92,107,82,0.12)",color:T.sage,fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",padding:"4px 10px",borderRadius:100,marginBottom:12}}>● Open Now</span>
                {[["Monday – Sunday","10:00 AM – 12:00 AM"],["Public Holidays","10:00 AM – 12:00 AM"]].map(([d,t])=>(
                  <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${T.border}`,fontSize:14}}>
                    <span style={{color:T.muted}}>{d}</span><span style={{fontWeight:500}}>{t}</span>
                  </div>
                ))}
                <p style={{fontSize:12,color:T.muted,marginTop:10}}>We're open every day of the year.</p>
              </> },
              { label:"🔗 Follow Us", content: <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:4}}>
                <Btn href="https://www.instagram.com/_tea_cartel/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener" variant="outline" style={{padding:"10px 18px",fontSize:13}}>📸 Instagram</Btn>
                <Btn href="https://www.zomato.com/jaipur/tea-cartel-jagatpura" target="_blank" rel="noopener" variant="outline" style={{padding:"10px 18px",fontSize:13}}>🍽️ Zomato</Btn>
              </div> },
            ].map(b => (
              <div key={b.label}>
                <h4 style={{fontSize:11,fontWeight:600,letterSpacing:"0.14em",textTransform:"uppercase",color:T.amber,marginBottom:10}}>{b.label}</h4>
                {b.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   INSTAGRAM
══════════════════════════════════════════ */
const igIcons = ["📸","🌿","🍔","☕","✨","🥟","🏺","🌅","🍜","🧊"];

function Instagram() {
  const ref = useReveal();
  return (
    <section id="instagram" style={{ padding:"clamp(64px,10vw,120px) 0" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ textAlign:"center", maxWidth:560, margin:"0 auto 48px" }}>
          <Eyebrow>@_tea_cartel</Eyebrow>
          <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>We're on Instagram.</h2>
          <Divider center/>
          <p style={{ fontSize:"clamp(15px,2vw,17px)", color:T.muted, lineHeight:1.75 }}>
            Aesthetic vibes, daily specials, and a whole lot of chai. Follow along for your daily dose of Tea Cartel.
          </p>
        </div>

        <div ref={ref} style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
          {igIcons.map((icon, i) => {
            const [hov, setHov] = useState(false);
            return (
              <a key={i} href="https://www.instagram.com/_tea_cartel/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener"
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{ aspectRatio:"1", borderRadius:12, background:"linear-gradient(135deg,#2C1A08,#3D2510)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, color:"rgba(200,135,58,0.3)", transition:"transform 0.2s", transform:hov?"scale(0.96)":"scale(1)", textDecoration:"none", position:"relative", overflow:"hidden" }}>
                {icon}
                <div style={{ position:"absolute", inset:0, background:hov?"rgba(200,135,58,0.15)":"transparent", transition:"background 0.2s" }}/>
              </a>
            );
          })}
        </div>

        <div style={{ textAlign:"center", marginTop:40 }}>
          <p style={{ fontFamily:T.serif, fontSize:22, marginBottom:16 }}>@_tea_cartel</p>
          <Btn href="https://www.instagram.com/_tea_cartel/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener">Follow on Instagram</Btn>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FAQ
══════════════════════════════════════════ */
const faqs = [
  { q:"Where is Tea Cartel located?", a:"We're located in Jagatpura, Jaipur, Rajasthan. Use Google Maps or call us at +91 95303 83938 for help finding us." },
  { q:"What are your opening hours?", a:"We're open every day from 10:00 AM to 12:00 AM (midnight), including weekends and public holidays." },
  { q:"Do you offer home delivery?", a:"Yes! Order from us on Zomato and Swiggy. Search 'Tea Cartel Jagatpura' or use the Order Online section on this page." },
  { q:"Is the seating open-air?", a:"Yes! Tea Cartel has a beautiful open-air ambience — especially lovely in the evenings. Perfect for conversations and golden-hour moments." },
  { q:"Do you serve non-vegetarian food?", a:"Our current menu is entirely vegetarian, featuring teas, cold coffees, burgers, momos, Chinese dishes, and soups — all made fresh." },
  { q:"Can I reserve a table for a group?", a:"Absolutely! Call +91 95303 83938 or DM us on Instagram @_tea_cartel to arrange a group visit or special occasion." },
  { q:"What's your most popular item?", a:"Our Cold Coffee and Kulhad Chai are the crowd favourites! The Tandoori Momos and Special Burger also have a massive fanbase." },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  const ref = useReveal();
  return (
    <section id="faq" style={{ padding:"clamp(64px,10vw,120px) 0", background:T.cardBg }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ textAlign:"center", maxWidth:600, margin:"0 auto 16px" }}>
          <Eyebrow>FAQ</Eyebrow>
          <h2 style={{ fontFamily:T.display, fontSize:"clamp(30px,5vw,50px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-0.02em" }}>Got questions?<br/>We've got answers.</h2>
        </div>

        <div ref={ref} style={{ maxWidth:720, margin:"48px auto 0" }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", padding:"22px 0", background:"none", border:"none", cursor:"pointer", fontFamily:T.body, fontSize:16, fontWeight:500, color: open===i ? T.amber : T.ink, gap:16, textAlign:"left" }}>
                {f.q}
                <div style={{ width:28, height:28, borderRadius:"50%", border:`1.5px solid ${open===i ? T.amber : T.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:16, background: open===i ? T.amber : "transparent", color: open===i ? "#fff" : T.muted, transform: open===i ? "rotate(45deg)" : "none", transition:"all 0.25s" }}>+</div>
              </button>
              <div style={{ maxHeight: open===i ? 200 : 0, overflow:"hidden", transition:"max-height 0.35s ease", fontSize:15, color:T.muted, lineHeight:1.75, paddingBottom: open===i ? 22 : 0 }}>
                {f.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer() {
  const footerLinks = [
    { title:"Menu", links:[{l:"Hot Tea & Coffee",h:"#menu"},{l:"Cold Drinks",h:"#menu"},{l:"Burgers",h:"#menu"},{l:"Momos",h:"#menu"},{l:"Chinese",h:"#menu"},{l:"Soups",h:"#menu"}] },
    { title:"Order Online", links:[{l:"Zomato",h:"https://www.zomato.com/jaipur/tea-cartel-jagatpura",ext:true},{l:"Swiggy",h:"https://www.swiggy.com/restaurants/1157814/dineout/menu",ext:true}] },
    { title:"Visit Us", links:[{l:"Jagatpura, Jaipur"},{l:"Rajasthan, India"},{l:"+91 95303 83938",h:"tel:+919530383938"},{l:"10:00 AM – 12:00 AM"},{l:"Open Every Day"}] },
  ];

  return (
    <footer style={{ background:T.ink, color:T.cream, padding:"clamp(48px,8vw,80px) 0 32px" }}>
      <div style={{ maxWidth:1120, margin:"0 auto", padding:"0 clamp(20px,5vw,48px)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:56, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontFamily:T.display, fontSize:32, fontWeight:900, color:"#FFF9F1", marginBottom:10 }}>Tea Cartel</div>
            <div style={{ fontFamily:T.serif, fontStyle:"italic", color:"rgba(250,246,238,0.4)", fontSize:15, marginBottom:18 }}>Sip. Chill. Repeat.</div>
            <p style={{ fontSize:14, color:"rgba(250,246,238,0.5)", lineHeight:1.75, maxWidth:260 }}>Jaipur's favourite open-air café serving handcrafted teas, cold coffees, momos, burgers, and a whole lot of warmth.</p>
          </div>
          {footerLinks.map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize:11, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(250,246,238,0.35)", marginBottom:16 }}>{col.title}</h5>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {col.links.map(link => (
                  <a key={link.l} href={link.h || "#"} target={link.ext ? "_blank" : undefined} rel={link.ext ? "noopener" : undefined}
                    style={{ fontSize:14, color:"rgba(250,246,238,0.6)", transition:"color 0.2s" }}
                    onMouseEnter={e => e.target.style.color=T.amberL}
                    onMouseLeave={e => e.target.style.color="rgba(250,246,238,0.6)"}>
                    {link.l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12, fontSize:12, color:"rgba(250,246,238,0.3)" }}>
          <span>© 2025 Tea Cartel, Jaipur. All rights reserved.</span>
          <div style={{ display:"flex", gap:12 }}>
            {[
              { icon:"📸", href:"https://www.instagram.com/_tea_cartel/?utm_source=ig_web_button_share_sheet", title:"Instagram" },
              { icon:"🍽️", href:"https://www.zomato.com/jaipur/tea-cartel-jagatpura", title:"Zomato" },
              { icon:"🛵", href:"https://www.swiggy.com/restaurants/1157814/dineout/menu", title:"Swiggy" },
              { icon:"📞", href:"tel:+919530383938", title:"Call" },
            ].map(s => (
              <a key={s.title} href={s.href} target="_blank" rel="noopener" title={s.title}
                style={{ width:36, height:36, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:"rgba(250,246,238,0.45)", textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.amber; e.currentTarget.style.color=T.amber; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(250,246,238,0.45)"; }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <Hero />
      <TrustBar />
      <About />
      <Menu />
      <Gallery />
      <Reviews />
      <Order />
      <Visit />
      <Instagram />
      <FAQ />
      <Footer />
    </>
  );
}
