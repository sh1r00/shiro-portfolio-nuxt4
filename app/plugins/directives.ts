// Client-safe interaction directives: v-reveal (scroll-in) and v-magnetic (cursor-follow).
// Both no-op under prefers-reduced-motion and on the server.
export default defineNuxtPlugin((nuxtApp) => {
  const prefersReduced = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nuxtApp.vueApp.directive('reveal', {
    mounted(el, binding) {
      if (import.meta.server) return
      if (prefersReduced()) return
      el.classList.add('reveal')
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            el.classList.toggle('is-revealed', e.isIntersecting)
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
      )
      io.observe(el)
      el._revealIO = io
    },
    unmounted(el) {
      el._revealIO?.disconnect()
    },
  })

  nuxtApp.vueApp.directive('magnetic', {
    mounted(el) {
      if (import.meta.server) return
      if (prefersReduced()) return
      el.style.transition = 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.willChange = 'transform'
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * 0.18
        const y = (e.clientY - r.top - r.height / 2) * 0.22
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      }
      const reset = () => {
        el.style.transform = 'translate(0px, 0px)'
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', reset)
      el._magMove = move
      el._magReset = reset
    },
    unmounted(el) {
      if (el._magMove) {
        el.removeEventListener('mousemove', el._magMove)
        el.removeEventListener('mouseleave', el._magReset)
      }
    },
  })

  // v-spotlight: a radial glow that follows the cursor (reads --spot-x/--spot-y).
  nuxtApp.vueApp.directive('spotlight', {
    mounted(el) {
      if (import.meta.server) return
      if (prefersReduced()) return
      el.style.setProperty('--spot-x', '50%')
      el.style.setProperty('--spot-y', '40%')
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--spot-x', `${e.clientX - r.left}px`)
        el.style.setProperty('--spot-y', `${e.clientY - r.top}px`)
      }
      el.addEventListener('mousemove', move)
      el._spotMove = move
    },
    unmounted(el) {
      if (el._spotMove) el.removeEventListener('mousemove', el._spotMove)
    },
  })

  // v-tilt: subtle 3D perspective tilt toward the cursor (degrees via binding value).
  nuxtApp.vueApp.directive('tilt', {
    mounted(el, binding) {
      if (import.meta.server) return
      if (prefersReduced()) return
      const max = typeof binding.value === 'number' ? binding.value : 6
      el.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.willChange = 'transform'
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        el.style.transform = `perspective(900px) rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg)`
      }
      const reset = () => {
        el.style.transform = ''
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', reset)
      el._tiltMove = move
      el._tiltReset = reset
    },
    unmounted(el) {
      if (el._tiltMove) {
        el.removeEventListener('mousemove', el._tiltMove)
        el.removeEventListener('mouseleave', el._tiltReset)
      }
    },
  })

  // v-parallax: subtle scroll-based translate (speed factor via binding value).
  nuxtApp.vueApp.directive('parallax', {
    mounted(el, binding) {
      if (import.meta.server) return
      if (prefersReduced()) return
      const speed = typeof binding.value === 'number' ? binding.value : 0.2
      let raf = 0
      const update = () => {
        raf = 0
        const r = el.getBoundingClientRect()
        const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
      }
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(update)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      update()
      el._parallaxScroll = onScroll
    },
    unmounted(el) {
      if (el._parallaxScroll) window.removeEventListener('scroll', el._parallaxScroll)
    },
  })
})
