$(document).ready(function () {
  $("#iniciarSesion").click(function (e) {
    e.preventDefault();

    var nombreUsuario = $("#username").val();
    var passwordUsuario = $("#password").val();

    // Obtener los datos almacenados en el Local Storage
    var usuarios = JSON.parse(localStorage.getItem("clientes"));

    if (!usuarios || !usuarios[nombreUsuario] || usuarios[nombreUsuario].password !== passwordUsuario    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre de usuario o contraseña incorrectos.",
      });
    } else {
      // Los datos son correctos, redirige a la página de opciones
      // Almacena el nombre de usuario en el Local Storage
      localStorage.setItem("nombreUsuario", nombreUsuario);
      window.location.href = "./opciones.html";


    }
  });
});



      // Después de redirigir al usuario a la página de opciones, obtener el nombre de usuario del Local Storage
      var nombreUsuario = localStorage.getItem("nombreUsuario");

      // Verificar si el nombre de usuario se ha almacenado en el Local Storage
      if (nombreUsuario) {
        // Mostrar el nombre de usuario en el elemento HTML
        document.getElementById("nombre-usuario").innerHTML = "Usuario: <strong>" + nombreUsuario + "</strong>";
      } else {
        // El nombre de usuario no se encontró en el Local Storage, maneja el caso en consecuencia
        document.getElementById("nombre-usuario").textContent = "Usuario no identificado";
      }



//Funcion para ver el saldo actual
$(document).ready(function () {
  $("#ver-saldo").click(function (e) {
    e.preventDefault();

    // Obtener el nombre de usuario del Local Storage
    var nombreUsuario = localStorage.getItem("nombreUsuario");

    // Obtener los datos del usuario del Local Storage
    var clientes = JSON.parse(localStorage.getItem("clientes"));

    if (nombreUsuario && clientes && clientes[nombreUsuario]) {
      var saldo = clientes[nombreUsuario].saldo;
      // Mostrar el saldo en algún elemento HTML (por ejemplo, un div con ID "saldo-resultado")
      $("#saldo").text("Saldo actual: " + saldo);
      registrarMovimiento(nombreUsuario, "Ver Saldo", saldo);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre de usuario no encontrado.",
      });
    }
  });
  mostrarMovimientos(nombreUsuario);
});
//Funcion para consignar
$(document).ready(function () {
  $("#consignar").click(function (e) {
    e.preventDefault();

    // Obtener el nombre de usuario del Local Storage
    var nombreUsuario = localStorage.getItem("nombreUsuario");
    var montoConsignar = parseFloat($("#monto-consignar").val()); // Convertir a número

    // Obtener los datos del usuario del Local Storage
    var clientes = JSON.parse(localStorage.getItem("clientes"));

    if (nombreUsuario && clientes && clientes[nombreUsuario]) {
      var usuario = clientes[nombreUsuario];
      var saldo = usuario.saldo;

      registrarMovimiento(nombreUsuario, "Consignacion", montoConsignar);
      // Verificar que el monto a consignar sea válido
      if (montoConsignar > 0) {
        // Actualizar el saldo del usuario en el Local Storage
        usuario.saldo += montoConsignar;
        localStorage.setItem("clientes", JSON.stringify(clientes));

        // Mostrar el saldo actualizado
        $("#saldo").text("Saldo actual: " + usuario.saldo);

        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Consignación exitosa.",
        });
        $("#monto-consignar").val("");
        registrarMovimiento(nombreUsuario, "Consignacion local", montoConsignar);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El monto a consignar debe ser mayor que cero.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre de usuario no encontrado.",
      });
    }
  });
  mostrarMovimientos(nombreUsuario);
});

$(document).ready(function () {
  $("#retirar").click(function (e) {
    e.preventDefault();

    // Obtener el nombre de usuario del Local Storage
    var nombreUsuario = localStorage.getItem("nombreUsuario");
    var montoRetirar = parseFloat($("#monto-retirar").val());

    // Obtener los datos del usuario del Local Storage
    var clientes = JSON.parse(localStorage.getItem("clientes"));

    if (nombreUsuario && clientes && clientes[nombreUsuario]) {
      var usuario = clientes[nombreUsuario];
      var saldo = usuario.saldo;

      // Verificar que el monto a retirar sea válido y no sea mayor que el saldo
      if (montoRetirar > 0 && montoRetirar <= saldo) {
        // Actualizar el saldo del usuario en el Local Storage
        usuario.saldo -= montoRetirar;
        localStorage.setItem("clientes", JSON.stringify(clientes));

        // Mostrar el saldo actualizado
        $("#saldo").text("Saldo actual: " + usuario.saldo);

        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Retiro exitoso.",
        });

        // Limpiar el campo de monto a retirar
        $("#monto-retirar").val("");
        registrarMovimiento(nombreUsuario, "Retiro local", montoRetirar);
      } else if (montoRetirar <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El monto a retirar debe ser mayor que cero.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El monto a retirar supera el saldo disponible.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre de usuario no encontrado.",
      });
    }
  });
  mostrarMovimientos(nombreUsuario);
});

$(document).ready(function () {
  $("#transferir").click(function (e) {
    e.preventDefault();

    // Obtener el nombre de usuario del Local Storage
    var nombreUsuario = localStorage.getItem("nombreUsuario");
    var usuarioDestino = $("#usuario-destino").val();
    var montoTransferir = $("#monto-transferir").val();

    // Obtener los datos del usuario del Local Storage
    var clientes = JSON.parse(localStorage.getItem("clientes"));

    if (!nombreUsuario || !clientes || !clientes[nombreUsuario]) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre de usuario no encontrado. Debes iniciar sesión primero.",
      });
      return;
    }

    if (!usuarioDestino) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debes ingresar el usuario destino para transferir.'
      });
      return;
    }

    if (montoTransferir === "") {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debes ingresar un monto para transferir.'
      });
      return;
    }

    // Convertir el monto a un valor flotante
    montoTransferir = parseFloat(montoTransferir);

    if (isNaN(montoTransferir) || montoTransferir <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El monto de transferencia no es válido.'
      });
      return;
    }

    if (!clientes[usuarioDestino]) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El usuario destino no existe.",
      });
      return;
    }

    var usuarioOrigen = clientes[nombreUsuario];

    if (montoTransferir > usuarioOrigen.saldo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Saldo insuficiente.",
      });
      return;
    }

    // Transferir el monto al usuario destino
    var usuarioDestinoData = clientes[usuarioDestino];
    usuarioOrigen.saldo -= montoTransferir;
    usuarioDestinoData.saldo += montoTransferir;
    localStorage.setItem("clientes", JSON.stringify(clientes));

    // Mostrar el saldo actualizado
    $("#saldo").text("Saldo actual: " + usuarioOrigen.saldo);

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Transferencia exitosa.",
    });

    // Limpiar los campos de usuario destino y monto a transferir
    $("#usuario-destino").val("");
    $("#monto-transferir").val("");
    registrarMovimiento(nombreUsuario, "Transferencia en Linea", montoTransferir, usuarioDestino);
  });
  mostrarMovimientosTransferencia(nombreUsuario);
});


// Función para registrar movimientos
function registrarMovimiento(usuario, descripcion, monto) {
  // Obtener la lista de movimientos del usuario del Local Storage
  var clientes = JSON.parse(localStorage.getItem("clientes"));

  if (clientes && clientes[usuario]) {
    if (!clientes[usuario].movimientos) {
      clientes[usuario].movimientos = [];
    }

    // Crear un objeto de movimiento
    var movimiento = {
      descripcion: descripcion,
      monto: monto,
    };

    // Agregar el movimiento a la lista de movimientos del usuario
    clientes[usuario].movimientos.push(movimiento);

    // Actualizar el Local Storage
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }
}

// Función para registrar transferencias 
function registrarMovimiento(usuario, descripcion, monto, clienteDestino) {
  // Obtener la lista de movimientos del usuario del Local Storage
  var clientes = JSON.parse(localStorage.getItem("clientes"));

  if (clientes && clientes[usuario]) {
    if (!clientes[usuario].movimientos) {
      clientes[usuario].movimientos = [];

    }

    // Crear un objeto de movimiento
    var movimiento = {
      descripcion: descripcion,
      monto: monto,
      clienteDestino: clienteDestino,
    };

    // Agregar el movimiento a la lista de movimientos del usuario
    clientes[usuario].movimientos.push(movimiento);

    // Actualizar el Local Storage
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }
}


function mostrarMovimientosTransferencia(usuario) {
  // Obtener la lista de movimientos del usuario del Local Storage
  var clientes = JSON.parse(localStorage.getItem("clientes"));

  if (clientes && clientes[usuario] && clientes[usuario].movimientos) {
    var movimientos = clientes[usuario].movimientos;
    var movimientosLista = $("#movimientos");

    // Limpiar la lista actual de movimientos
    movimientosLista.empty();

    for (var i = 0; i < movimientos.length; i++) {
      if (i % 4 === 0) {
        // Comenzar una nueva fila después de cada 4 movimientos
        if (i !== 0) {
          movimientosLista.append("</div>"); // Cerrar la fila anterior
        }
        movimientosLista.append("<div class='fila'>"); // Abrir una nueva fila
      }

      var movimiento = movimientos[i];
      var movimientoHTML =
        "<div class='movimiento'>" +
        "<p>Usuario: " + usuario + "</p>" +
        "<p>Descripción: " + movimiento.descripcion + "</p>" +
        "<p>Monto: $" + movimiento.monto + "</p>";

      if (movimiento.clienteDestino) {
        movimientoHTML += "<p>Cliente destino: " + movimiento.clienteDestino + "</p>";
      }

      movimientoHTML += "</div>";
      movimientosLista.append(movimientoHTML);

      if (i === movimientos.length - 1) {
        // Cerrar la última fila si no se han cerrado
        movimientosLista.append("</div>");
      }
    }
  }
}



function mostrarMovimientos(usuario) {
  // Obtener la lista de movimientos del usuario del Local Storage
  var clientes = JSON.parse(localStorage.getItem("clientes"));

  if (clientes && clientes[usuario] && clientes[usuario].movimientos) {
    var movimientos = clientes[usuario].movimientos;
    var movimientosLista = $("#movimientos");

    // Limpiar la lista actual de movimientos
    movimientosLista.empty();

    // Recorrer la lista de movimientos y agregarlos como elementos de lista
    for (var i = 0; i < movimientos.length; i++) {
      var movimiento = movimientos[i];
      var movimientoHTML =
        "<li>" + movimiento.descripcion + ": $" + movimiento.monto + "</li>";
      movimientosLista.append(movimientoHTML);
    }
  }
  //registrarMovimiento(usuario, "Descripción del Movimiento", monto);
  //mostrarMovimientos(usuario);
}

// Después de registrar un movimiento

$(document).ready(function () {
  // Cuando se hace clic en el botón "Mostrar Movimientos"
  $("#mostrar-movimientos").click(function () {
    // Mostrar la lista de movimientos y ocultar el botón "Mostrar Movimientos"
    $("#movimientos").show();
    $("#mostrar-movimientos").hide();
    // Mostrar el botón "Cerrar Movimientos"
    $("#cerrar-movimientos").show();
    // Llama a la función para mostrar los movimientos
    mostrarMovimientosTransferencia(nombreUsuario);
  });

  // Cuando se hace clic en el botón "Cerrar Movimientos"
  $("#cerrar-movimientos").click(function () {
    // Ocultar la lista de movimientos
    $("#movimientos").hide();
    // Mostrar el botón "Mostrar Movimientos" y ocultar el botón "Cerrar Movimientos"
    $("#mostrar-movimientos").show();
    $("#cerrar-movimientos").hide();
  });
});
