async function obtenerPersonajes() {
  const respuesta = await fetch("https://rickandmortyapi.com/api/character");
  const datos = await respuesta.json();
  return datos.results;
}

function filtrarPorEstado(personajes, estado) {
  return personajes.filter(function (personaje) {
    return personaje.status.toLowerCase() === estado;
  });
}
function filtrarPorEspecie(personajes, especie) {
  return personajes.filter(function (personaje) {
    return personaje.species === especie;
  });
}
function obtenerNombres(personajes) {
  return personajes.map(function (personaje) {
    return personaje.name;
  });
}
function buscarPorNombre(personajes, nombre) {
  return personajes.find(function (personaje) {
    return personaje.name === nombre;
  });
}
function hayPersonajesMuertos(personajes) {
  return personajes.some(function (personaje) {
    return personaje.status === "Dead";
  });
}
function todosVivos(personajes) {
  return personajes.every(function (personaje) {
    return personaje.status === "Alive";
  });
}
function ordenarPorNombre(personajes) {
  return [...personajes].sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}
function primeros(personajes, cantidad) {
  return personajes.slice(0, cantidad);
}
function posicionDeNombre(nombres, nombre) {
  return nombres.indexOf(nombre);
}
function contarVivos(personajes) {
  return personajes.reduce(function (total, personaje) {
    return personaje.status === "Alive" ? total + 1 : total;
  }, 0);
}
let personajes = [];

function aplicarFiltros() {
  const nombre = document.querySelector("#filtro-nombre").value.trim().toLowerCase();
  const estado = document.querySelector("#filtro-estado").value;
  const especie = document.querySelector("#filtro-especie").value;
  
  const ordenar = document.querySelector("#check-ordenar").checked;
  const primeros10 = document.querySelector("#check-primeros").checked;

  let filtrados = personajes; 

  if (estado !== "") {
    filtrados = filtrarPorEstado(filtrados, estado);
  }
  if (especie !== "") {
    filtrados = filtrarPorEspecie(filtrados, especie);
  }
  if (nombre !== "") {
    filtrados = filtrados.filter(function (personaje) {
      return personaje.name.toLowerCase().includes(nombre);
    });
  }

  if (ordenar) {
    filtrados = ordenarPorNombre(filtrados);
  }
  if (primeros10) {
    filtrados = primeros(filtrados, 10);
  }

  pintarResultados(filtrados);
}

function pintarResultados(lista) {
  const contenedor = document.querySelector("#resultados");
  
  const vivos = contarVivos(lista);
  let textoContador = lista.length + " personajes encontrados. " + vivos + " están vivos.";
  
  if (hayPersonajesMuertos(lista)) {
    textoContador = textoContador + " (Hay muertos en el resultado)";
  }
  
  document.querySelector("#contador").textContent = textoContador;

  const listaDeNombres = obtenerNombres(personajes); 

  contenedor.innerHTML = lista
    .map(function (personaje) {
      const posicion = posicionDeNombre(listaDeNombres, personaje.name) + 1;

      return (
        '<article class="personaje-card">' +
        '<div class="numero-id">#' + posicion + '</div>' + 
        '<img src="' +
        personaje.image +
        '" alt="' +
        personaje.name +
        '" />' +
        "<h3>" +
        personaje.name +
        "</h3>" +
        "<p>" +
        personaje.status +
        " · " +
        personaje.species +
        "</p>" +
        "</article>"
      );
    })
    .join("");
}

document.querySelector("#filtro-nombre").addEventListener("input", aplicarFiltros);
document.querySelector("#filtro-estado").addEventListener("change", aplicarFiltros);
document.querySelector("#filtro-especie").addEventListener("change", aplicarFiltros);

document.querySelector("#check-ordenar").addEventListener("change", aplicarFiltros);
document.querySelector("#check-primeros").addEventListener("change", aplicarFiltros);

document.querySelector("#limpiar-filtros").addEventListener("click", function() {
  setTimeout(aplicarFiltros, 10);
});

obtenerPersonajes().then(function (datos) {
  personajes = datos;
  aplicarFiltros();
});