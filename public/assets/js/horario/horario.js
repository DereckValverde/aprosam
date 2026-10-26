/* 
Esta funcion el endpoint encargado de traer todas 
las colaboradoras existentes y luego colocarlas en el UI del
módulo de horario 
*/
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

/*
Funcion encargada de determinar el primer día inicial de cada mes
tomando en cuenta como variables el día, mes y año, donde:

dia siempre va a ser 1 para determinar EL PRIMER día del mes.

mes será igual a (mes - 1) ya que en Date(YYYY,MM,DD) el primer mes
es enero, que enero = 0, febrero = 1... así que dentro de la función
se contempla esto y se coloca mes - 1, para que por parametro se pueda 
colocar el mes correspondiente como normalmente es:

enero = 1, febrero = 2... agosto = 8... diciembre = 11

tener en cuenta que "return primerDia" es:

domingo = 0
lunes = 1
martes = 2
...
*/

function determinarPrimerDia(mes, anio) {
  //Se corrije el mes para que coincida con el formato de Date();
  mes = mes - 1;

  //Formato YYYY/MM/DD
  const fecha = new Date(anio, mes, 1);

  const primerDia = fecha.getDay();

  return primerDia;
}

console.log(determinarPrimerDia(11, 2026));

//cargarListaColaboradoras();
