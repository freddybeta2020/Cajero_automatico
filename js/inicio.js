$(document).ready(function() {
  $('#registro').click(function(e) {
      e.preventDefault();

      var usuario = $('#username').val();
      var contraseña = $('#password').val();

  // Obtener la lista de usuarios existentes del localStorage
var usuariosRegistrados = JSON.parse(localStorage.getItem("usuariosRegistrados")) || {};

// Verificar si el nombre de usuario ya está en uso
if (usuariosRegistrados[usuario]) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Nombre de usuario ya existe, no se puede duplicar.'
    });
    return;
}

// Si el nombre de usuario no está en uso, agregarlo a la lista de usuarios registrados
usuariosRegistrados[usuario] = true;
localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados));

// Continuar con el proceso de registro


      // Validar contraseña (puedes personalizar estas validaciones)
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(contraseña)) {
          alert('La contraseña debe tener al menos 8 caracteres, 1 mayúscula y 1 número.');
          return;
      }

      // Crear un objeto con los datos del usuario
      var usuarioData = {
          username: usuario,
          password: contraseña,
          saldo: 200000 // Saldo por defecto
      };

      // Guardar el usuario en el localStorage con la clave "clientes"
      if (!localStorage.getItem("clientes")) {
          localStorage.setItem("clientes", JSON.stringify({}));
      }

      var clientes = JSON.parse(localStorage.getItem("clientes"));
      clientes[usuario] = usuarioData;
      localStorage.setItem("clientes", JSON.stringify(clientes));
      console.log("Guardado de forma correcta");
      Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario registrado de forma correcta.'
      });

      setTimeout(function () {
          location.reload();
      }, 2000); // 2000 milisegundos (2 segundos)
  });
});



/* $('#registro').click(registrarse);

  // Ejemplo de cómo consultar un usuario en el localStorage
  function consultarUsuario() {
    var usuario = prompt('Ingrese su nombre de usuario:');
    var userData = localStorage.getItem(usuario);
  
    if (userData) {
      userData = JSON.parse(userData);
      alert('Nombre de usuario: ' + userData.username + '\nSaldo: ' + userData.saldo);
    } else {
      alert('Usuario no encontrado.');
    }
  } */
  