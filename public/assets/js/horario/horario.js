/* Esta funcion el endpoint encargado de traer todas 
las colaboradoras existentes y luego colocarlas en el UI del
módulo de horario */

async function cargarListaColaboradoras() {
  // Div donde se muestra la lista de colaboradoras en el UI del módulo de horario
  const listaColaboradoras = document.getElementById("listaColaboradoras");

  try {
    //Se llama a la api para obtener las colaboradoras
    const response = await fetch(BASE_URL + "colaboradoras");
    const colaboradoras = await response.json();

    listaColaboradoras.innerHTML = "";

    if (colaboradoras.success) {
      colaboradoras.data.forEach((colaboradora) => {
        listaColaboradoras.innerHTML += `
            <div class = "colaboradorasFondo">

                <div class = "cajaColaboradora">

                    <div class= "cajaContenido">

                        <div class = "cajaNombre">

                        <img src = "${BASE_URL + "public/assets/images/logo.jpg"}">
                        <span>${colaboradora.nombre}</pan>

                        </div>

                        <div class = "cajaTurnos"><span>0 Turnos</span></div>

                    </div>
                    <div class="cajaFiltro"><i class="bi bi-funnel"></i></div>
                </div>
            </div>
        `;
      });
    }
  } catch (error) {
    console.log(error);
  }
}

cargarListaColaboradoras();
