document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('menu-toggle')
  const mobile = document.getElementById('mobile-menu')
  if (!checkbox || !mobile) return

  const sync = () => mobile.classList.toggle('hidden', !checkbox.checked)
  checkbox.addEventListener('change', sync)
  sync()

  mobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      checkbox.checked = false
      sync()
    })
  })
})
