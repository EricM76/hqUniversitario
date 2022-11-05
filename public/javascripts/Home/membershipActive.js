window.addEventListener("load", async () => {
  const BASE_URL = window.location.origin;
  const params = new URLSearchParams(document.location.search);
  const userId = params.get("userId");
  if (userId) {
    try {
      let response = await fetch(`${BASE_URL}/membresias/usuario/${userId}`);
      if (response.ok) {
        let json = await response.json();
        if (json.quotasAvailable > 0) {
          Swal.fire({
            title: `Tienes ${json.quotasAvailable} cupos disponibles`,
            text: "Elije tus materias antes de que expire tu membresía",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vamos!",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/usuario/perfil#membership";
            }
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Validar

  // warning de vencimiento de membresia
});
