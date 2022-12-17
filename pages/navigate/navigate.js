
export function initNavigate() {
  document.getElementById("btn").onclick = () => {
    const route = document.getElementById("route-to-navigate-to").value
    window.router.navigate(route)
  }
}