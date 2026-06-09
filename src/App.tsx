import { useEffect, useMemo, useState } from 'react'
import './App.css'

type MenuItem = {
  name: string
  detail: string
  price?: string
  category: string
  badge?: string
}

type Restaurant = {
  slug: string
  name: string
  shortName: string
  cuisine: string
  tagline: string
  headline: string
  intro: string
  address: string
  phone?: string
  whatsapp?: string
  mapUrl: string
  hours: string
  logo?: string
  logoKind?: 'light' | 'dark'
  heroImage?: string
  heroAlt: string
  theme: string
  layout: 'terrace' | 'fast' | 'bistro' | 'atelier' | 'lounge'
  primaryAction: string
  secondaryAction: string
  bookingHeadline: string
  bookingBody: string
  takeoutHeadline: string
  takeoutBody: string
  times: string[]
  takeoutModes: string[]
  menu: MenuItem[]
  sections: { label: string; title: string; body: string }[]
  seo: { title: string; description: string }
}

const restaurants: Restaurant[] = [
  {
    slug: 'wanda',
    name: 'Wanda Lounge & Restaurante',
    shortName: 'Wanda',
    cuisine: 'Lounge · Música · Mesas de grupo',
    tagline: 'Noche, platos y reservas de grupo',
    headline: 'Mesa, música y platos para una noche con gente.',
    intro: 'Energía para grupos, cumpleaños, platos para compartir y contacto rápido antes de salir.',
    address: 'Malabo, Guinea Ecuatorial',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Wanda+Lounge+Restaurante+Malabo',
    hours: 'Tarde y noche bajo consulta',
    heroAlt: 'Ambiente lounge con mesa de grupo y música',
    theme: 'theme-wanda',
    layout: 'lounge',
    primaryAction: 'Reservar grupo',
    secondaryAction: 'Ver late menu',
    bookingHeadline: 'Cumpleaños, grupo o noche especial.',
    bookingBody: 'Indica número de personas, hora y tipo de mesa para preparar la solicitud.',
    takeoutHeadline: 'Platos y platters para recoger.',
    takeoutBody: 'Consulta wings, tablas y cajas para arrancar la noche antes de llegar.',
    times: ['20:00', '22:30', 'Cumpleaños', 'Evento'],
    takeoutModes: ['Recogida tarde', 'Platter grupo', 'Conductor recoge'],
    sections: [
      { label: 'Lounge', title: 'Más evento que comedor clásico.', body: 'Mesas de grupo, música, platos para compartir y contacto rápido antes de salir.' },
      { label: 'Grupos', title: 'Reserva la noche antes de llegar.', body: 'Cumpleaños, late menu y platters aparecen juntos para que la solicitud llegue completa.' },
    ],
    menu: [
      { name: 'Wanda wings', detail: 'Alitas glaseadas, salsa picante y papas crujientes.', price: '8.500 XAF', category: 'Late menu', badge: 'Late' },
      { name: 'Tabla lounge', detail: 'Bocados para compartir antes de la música.', price: '15.000 XAF', category: 'Grupo', badge: 'Mesa' },
      { name: 'Mocktail neon', detail: 'Bebida sin alcohol, fruta tropical y toque ácido.', price: '4.000 XAF', category: 'Bebidas', badge: 'Bar' },
      { name: 'Platter para llevar', detail: 'Caja para grupo con wings, papas y salsas.', price: '18.000 XAF', category: 'Pickup', badge: 'Grupo' },
    ],
    seo: { title: 'Wanda Lounge & Restaurante Malabo · Mesas y Late Menu', description: 'Wanda Lounge & Restaurante: mesas de grupo, late menu, música y consultas por WhatsApp en Malabo.' },
  },
]
const englishRestaurants: Record<string, Partial<Restaurant>> = {
  wanda: {
    cuisine: 'Lounge · Music · Group tables',
    tagline: 'Night, plates and group bookings',
    headline: 'Table, music and shared plates for a night out.',
    intro: 'Energy for groups, birthdays, sharing plates and fast contact before heading out.',
    hours: 'Afternoon and night by request',
    primaryAction: 'Book a group',
    secondaryAction: 'View late menu',
    bookingHeadline: 'Birthday, group or special night.',
    bookingBody: 'Send party size, time and table type to prepare the request.',
    takeoutHeadline: 'Plates and platters for pickup.',
    takeoutBody: 'Ask about wings, boards and boxes to start the night before arrival.',
    times: ['20:00', '22:30', 'Birthday', 'Event'],
    takeoutModes: ['Late pickup', 'Group platter', 'Driver pickup'],
    sections: [
      { label: 'Lounge', title: 'More event than classic dining room.', body: 'Group tables, music, sharing plates and fast contact before going out.' },
      { label: 'Groups', title: 'Book the night before arrival.', body: 'Birthdays, late menu and platters sit together so the request arrives complete.' },
    ],
    menu: [
      { name: 'Wanda wings', detail: 'Glazed wings, spicy sauce and crisp fries.', price: '8,500 XAF', category: 'Late menu', badge: 'Late' },
      { name: 'Lounge board', detail: 'Sharing bites before the music.', price: '15,000 XAF', category: 'Group', badge: 'Table' },
      { name: 'Neon mocktail', detail: 'Alcohol-free drink with tropical fruit and a bright acidic finish.', price: '4,000 XAF', category: 'Drinks', badge: 'Bar' },
      { name: 'Pickup platter', detail: 'Group box with wings, fries and sauces.', price: '18,000 XAF', category: 'Pickup', badge: 'Group' },
    ],
    seo: { title: 'Wanda Lounge & Restaurante Malabo · Group Tables and Late Menu', description: 'Wanda Lounge & Restaurante: group tables, late menu, music and WhatsApp requests in Malabo.' },
  },
}
function localizeRestaurant(restaurant: Restaurant, language: 'es' | 'en') {
  if (language === 'es') return restaurant
  return { ...restaurant, ...englishRestaurants[restaurant.slug] }
}

const SITE_SLUG = 'wanda'

function getRestaurant() {
  return restaurants.find((item) => item.slug === SITE_SLUG) ?? restaurants[0]
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function waLink(restaurant: Restaurant, message: string) {
  const number = restaurant.whatsapp ?? restaurant.phone?.replace(/\D/g, '')
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`
}

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = document.createElement('meta')
    Object.entries(attributes).forEach(([key, value]) => meta?.setAttribute(key, value))
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function fallbackMark(restaurant: Restaurant) {
  if (restaurant.layout === 'atelier') return <span className="fallback-mark atelier-mark">A</span>
  if (restaurant.layout === 'lounge') return <span className="fallback-mark wanda-mark">W</span>
  return <span className="fallback-mark">{restaurant.shortName.slice(0, 1)}</span>
}

function App() {
  const baseRestaurant = getRestaurant()
  const [language, setLanguage] = useState<'es' | 'en'>('es')
  const restaurant = useMemo(() => localizeRestaurant(baseRestaurant, language), [baseRestaurant, language])
  const copy = {
    es: { skip: 'Saltar a la carta', home: 'inicio', navLabel: 'Navegación principal', conversionLabel: 'Reservas y pedidos', menu: 'Carta', bookings: 'Reservas', orders: 'Pedidos', visit: 'Visita', all: 'Todos', menuTitle: 'Platos destacados para decidir rápido.', menuBody: 'Filtra por categoría y abre una consulta directa si quieres reservar o pedir.', filter: 'Filtrar categorías de carta', booking: 'Reservas', order: 'Pedidos', name: 'Nombre', contact: 'Teléfono o WhatsApp', date: 'Fecha', time: 'Hora', guests: 'Personas', mode: 'Modalidad', details: 'Detalles', bookingCta: 'Abrir mensaje de reserva', orderCta: 'Abrir mensaje de pedido', itemCta: 'Consultar plato', map: 'Abrir mapa', whatsapp: 'WhatsApp', call: 'Llamar', switcher: 'English', langLabel: 'Cambiar idioma a inglés' },
    en: { skip: 'Skip to menu', home: 'home', navLabel: 'Main navigation', conversionLabel: 'Bookings and orders', menu: 'Menu', bookings: 'Bookings', orders: 'Orders', visit: 'Visit', all: 'All', menuTitle: 'Featured plates for a quick decision.', menuBody: 'Filter by category, then open a direct request for a table or pickup order.', filter: 'Filter menu categories', booking: 'Bookings', order: 'Orders', name: 'Name', contact: 'Phone or WhatsApp', date: 'Date', time: 'Time', guests: 'Guests', mode: 'Mode', details: 'Details', bookingCta: 'Open booking message', orderCta: 'Open order message', itemCta: 'Ask about dish', map: 'Open map', whatsapp: 'WhatsApp', call: 'Call', switcher: 'Español', langLabel: 'Switch language to Spanish' },
  }[language]
  const [category, setCategory] = useState(copy.all)
  const [booking, setBooking] = useState({ name: '', contact: '', date: '', time: restaurant.times[0], guests: '2 personas' })
  const [takeout, setTakeout] = useState({ name: '', contact: '', mode: restaurant.takeoutModes[0], notes: '' })


  useEffect(() => {
    document.title = restaurant.seo.title
    document.documentElement.lang = language
    const pageUrl = window.location.href
    const imageUrl = restaurant.heroImage ? `${window.location.origin}${restaurant.heroImage}` : undefined
    upsertMeta('meta[name="description"]', { name: 'description' }, restaurant.seo.description)
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, restaurant.seo.title)
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, restaurant.seo.description)
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'restaurant')
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl)
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, imageUrl ? 'summary_large_image' : 'summary')
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, restaurant.seo.title)
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, restaurant.seo.description)
    if (imageUrl) {
      upsertMeta('meta[property="og:image"]', { property: 'og:image' }, imageUrl)
      upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, imageUrl)
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurant.name,
      description: restaurant.seo.description,
      servesCuisine: restaurant.cuisine,
      address: restaurant.address,
      telephone: restaurant.phone,
      url: window.location.origin,
      inLanguage: language,
      hasMap: restaurant.mapUrl,
      image: restaurant.heroImage ? `${window.location.origin}${restaurant.heroImage}` : undefined,
      acceptsReservations: true,
    }
    const existingSchema = document.getElementById('restaurant-structured-data')
    existingSchema?.remove()
    const script = document.createElement('script')
    script.id = 'restaurant-structured-data'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema, (_key, value) => value === undefined ? undefined : value)
    document.head.appendChild(script)
  }, [restaurant, language])

  const categories = useMemo(() => [copy.all, ...Array.from(new Set(restaurant.menu.map((item) => item.category)))], [restaurant.menu, copy.all])
  const activeCategory = categories.includes(category) ? category : copy.all
  const visibleMenu = activeCategory === copy.all ? restaurant.menu : restaurant.menu.filter((item) => item.category === activeCategory)
  const guestOptions = language === 'es' ? ['2 personas', '4 personas', '6 personas', 'Grupo privado'] : ['2 guests', '4 guests', '6 guests', 'Private group']
  const selectedTime = restaurant.times.includes(booking.time) ? booking.time : restaurant.times[0]
  const selectedGuests = guestOptions.includes(booking.guests) ? booking.guests : guestOptions[0]
  const selectedTakeoutMode = restaurant.takeoutModes.includes(takeout.mode) ? takeout.mode : restaurant.takeoutModes[0]
  const bookingReady = booking.name.trim() && booking.contact.trim() && booking.date && selectedTime && selectedGuests
  const takeoutReady = takeout.name.trim() && takeout.contact.trim() && selectedTakeoutMode
  const bookingMessage = language === 'es'
    ? `Hola ${restaurant.name}, quiero reservar. Nombre: ${booking.name || '[nombre]'}. Contacto: ${booking.contact || '[teléfono]'}. Fecha: ${booking.date || '[fecha]'}. Hora: ${selectedTime}. Personas: ${selectedGuests}.`
    : `Hello ${restaurant.name}, I would like to book. Name: ${booking.name || '[name]'}. Contact: ${booking.contact || '[phone]'}. Date: ${booking.date || '[date]'}. Time: ${selectedTime}. Guests: ${selectedGuests}.`
  const takeoutMessage = language === 'es'
    ? `Hola ${restaurant.name}, quiero consultar un pedido para llevar. Nombre: ${takeout.name || '[nombre]'}. Contacto: ${takeout.contact || '[teléfono]'}. Modalidad: ${selectedTakeoutMode}. Detalles: ${takeout.notes || '[pedido]'}.`
    : `Hello ${restaurant.name}, I would like to ask about a pickup order. Name: ${takeout.name || '[name]'}. Contact: ${takeout.contact || '[phone]'}. Mode: ${selectedTakeoutMode}. Details: ${takeout.notes || '[order]'}.`
  const menuInquiryMessage = (item: MenuItem) => language === 'es'
    ? `Hola ${restaurant.name}, quiero consultar este plato: ${item.name}. ¿Está disponible hoy?`
    : `Hello ${restaurant.name}, I would like to ask about this dish: ${item.name}. Is it available today?`

  return (
    <main className={`site ${restaurant.theme} layout-${restaurant.layout}`}>
      <a className="skip-link" href="#menu">{copy.skip}</a>
      <nav className="topbar shell" aria-label={`${restaurant.name} ${copy.navLabel}`}>
        <a className={`brand ${restaurant.logoKind === 'light' ? 'brand-light' : ''}`} href="/" aria-label={`${restaurant.name} ${copy.home}`}>
          {restaurant.logo ? <img src={restaurant.logo} alt={`${restaurant.name} logo`} /> : fallbackMark(restaurant)}
          <span>{restaurant.name}</span>
        </a>
        <div className="nav-links">
          <a href="#menu">{copy.menu}</a>
          <a href="#reservas">{copy.bookings}</a>
          <a href="#pedidos">{copy.orders}</a>
          <a href="#visita">{copy.visit}</a>
          <button className="lang-toggle" type="button" aria-label={copy.langLabel} onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}>{copy.switcher}</button>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">{restaurant.cuisine}</p>
          <h1>{restaurant.headline}</h1>
          <p>{restaurant.intro}</p>
          <div className="hero-actions">
            <a className="button primary" href="#reservas">{restaurant.primaryAction}</a>
            <a className="button ghost" href="#menu">{restaurant.secondaryAction}</a>
          </div>
        </div>
        <div className="hero-panel" aria-label={restaurant.heroAlt}>
          {restaurant.heroImage ? <img src={restaurant.heroImage} alt={restaurant.heroAlt} /> : <div className="venue-hero" aria-hidden="true"><span>{restaurant.shortName}</span></div>}
          <div className="hero-card">
            <span>{restaurant.tagline}</span>
            <strong>{restaurant.hours}</strong>
            <a href={restaurant.mapUrl} target="_blank" rel="noreferrer">{copy.map}</a>
          </div>
        </div>
      </section>

      <section className="story-grid shell" aria-label={`${restaurant.name} detalles`}>
        {restaurant.sections.map((section) => (
          <article key={section.label}>
            <span>{section.label}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section id="menu" className="menu-section shell">
        <div className="section-head">
          <p className="eyebrow">{copy.menu}</p>
          <h2>{copy.menuTitle}</h2>
          <p>{copy.menuBody}</p>
        </div>
        <div className="chips" aria-label={copy.filter}>
          {categories.map((item) => (
            <button key={item} className={item === activeCategory ? 'chip active' : 'chip'} aria-pressed={item === activeCategory} onClick={() => setCategory(item)} type="button">{item}</button>
          ))}
        </div>
        <div className="menu-list">
          {visibleMenu.map((item) => (
            <article className="menu-item" key={item.name}>
              <div>
                {item.badge ? <span>{item.badge}</span> : null}
                <h3>{item.name}</h3>
                <p>{item.detail}</p>
                <a className="menu-inquiry" href={waLink(restaurant, menuInquiryMessage(item))} target="_blank" rel="noreferrer">{copy.itemCta}</a>
              </div>
              {item.price ? <strong>{item.price}</strong> : null}
            </article>
          ))}
        </div>
      </section>

      <section className="conversion shell" aria-label={copy.conversionLabel}>
        <form id="reservas" className="form-card booking" onSubmit={(event) => event.preventDefault()}>
          <p className="eyebrow">{copy.booking}</p>
          <h2>{restaurant.bookingHeadline}</h2>
          <p>{restaurant.bookingBody}</p>
          <label>{copy.name}<input autoComplete="name" value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} required /></label>
          <label>{copy.contact}<input autoComplete="tel" inputMode="tel" value={booking.contact} onChange={(event) => setBooking({ ...booking, contact: event.target.value })} required /></label>
          <div className="form-row">
            <label>{copy.date}<input type="date" min={today()} value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} required /></label>
            <label>{copy.time}<select value={selectedTime} onChange={(event) => setBooking({ ...booking, time: event.target.value })}>{restaurant.times.map((time) => <option key={time}>{time}</option>)}</select></label>
          </div>
          <label>{copy.guests}<select value={selectedGuests} onChange={(event) => setBooking({ ...booking, guests: event.target.value })}>{guestOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <a className={bookingReady ? 'button primary wide' : 'button primary wide disabled'} href={bookingReady ? waLink(restaurant, bookingMessage) : '#reservas'} aria-disabled={!bookingReady} aria-describedby="booking-status" tabIndex={bookingReady ? undefined : -1} onClick={(event) => { if (!bookingReady) event.preventDefault() }}>{copy.bookingCta}</a>
          <p id="booking-status" className="form-status" aria-live="polite">{bookingReady ? (language === 'es' ? 'Listo para enviar por WhatsApp.' : 'Ready to send by WhatsApp.') : (language === 'es' ? 'Completa nombre, contacto, fecha y hora para activar la solicitud.' : 'Complete name, contact, date and time to activate the request.')}</p>
        </form>

        <form id="pedidos" className="form-card takeout" onSubmit={(event) => event.preventDefault()}>
          <p className="eyebrow">{copy.order}</p>
          <h2>{restaurant.takeoutHeadline}</h2>
          <p>{restaurant.takeoutBody}</p>
          <label>{copy.name}<input autoComplete="name" value={takeout.name} onChange={(event) => setTakeout({ ...takeout, name: event.target.value })} required /></label>
          <label>{copy.contact}<input autoComplete="tel" inputMode="tel" value={takeout.contact} onChange={(event) => setTakeout({ ...takeout, contact: event.target.value })} required /></label>
          <label>{copy.mode}<select value={selectedTakeoutMode} onChange={(event) => setTakeout({ ...takeout, mode: event.target.value })}>{restaurant.takeoutModes.map((mode) => <option key={mode}>{mode}</option>)}</select></label>
          <label>{copy.details}<textarea value={takeout.notes} onChange={(event) => setTakeout({ ...takeout, notes: event.target.value })} /></label>
          <a className={takeoutReady ? 'button ghost wide strong' : 'button ghost wide disabled'} href={takeoutReady ? waLink(restaurant, takeoutMessage) : '#pedidos'} aria-disabled={!takeoutReady} aria-describedby="takeout-status" tabIndex={takeoutReady ? undefined : -1} onClick={(event) => { if (!takeoutReady) event.preventDefault() }}>{copy.orderCta}</a>
          <p id="takeout-status" className="form-status" aria-live="polite">{takeoutReady ? (language === 'es' ? 'Listo para consultar el pedido por WhatsApp.' : 'Ready to ask about the order by WhatsApp.') : (language === 'es' ? 'Completa nombre, contacto y modalidad para activar la consulta.' : 'Complete name, contact and mode to activate the request.')}</p>
        </form>
      </section>

      <section id="visita" className="visit shell">
        <div>
          <p className="eyebrow">{copy.visit}</p>
          <h2>{restaurant.address}</h2>
          <p>{restaurant.hours}{restaurant.phone ? ` · ${restaurant.phone}` : ''}</p>
        </div>
        <div className="visit-actions">
          <a className="button primary" href={restaurant.mapUrl} target="_blank" rel="noreferrer">{copy.map}</a>
          <a className="button ghost strong" href={waLink(restaurant, language === 'es' ? `Hola ${restaurant.name}, quiero información.` : `Hello ${restaurant.name}, I would like information.`)} target="_blank" rel="noreferrer">{copy.whatsapp}</a>
          {restaurant.phone ? <a className="button ghost strong" href={`tel:${restaurant.phone.replace(/\D/g, '')}`}>{copy.call}</a> : null}
        </div>
      </section>
    </main>
  )
}

export default App
