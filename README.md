ARQUITECTURA DEL SISTEMA

Fase Inicial

1) Frontend: Next.js
Desarrolla la interfaz de usuario y maneja el enrutamiento y el renderizado del lado del servidor.
2) NoSQL: Firebase (Firestore o Realtime Database)
Usa Firebase para manejar la autenticación y almacenar datos flexibles y escalables, como perfiles de usuario y servicios.
3) Estado Global: Context API
Implementa Context API para manejar el estado global de la aplicación de manera sencilla.

Fase de Expansión (si la aplicación crece y requiere más funcionalidades)

1) Frontend: Next.js
Continúa desarrollando y optimizando la interfaz de usuario.
2) NoSQL: Firebase (Firestore o Realtime Database)
Mantén Firebase para datos que requieren flexibilidad y alta disponibilidad.
3) SQL: PostgreSQL
Integra Cloud SQL para manejar datos estructurados y realizar consultas complejas, como transacciones y reservas.
4) ORM: Prisma
Usa Prisma para interactuar con la base de datos SQL de manera eficiente y manejar migraciones de esquema.
5) API/Middleware: Node.js (en Firebase Functions)
Desarrolla una API en Node.js para manejar la lógica del lado del servidor y la integración entre Firebase y PostgreSQL.
6) Estado Global: Context API
Continúa usando Context API para manejar el estado global de la aplicación.

____________________________________________________________________________________________________________________

ESTRUCTURA DE LA BASE DE DATOS NoSQL EN FIREBASE

1. Usuarios

Colección: users
Documento: {userId}
Campos:
- name: Nombre del usuario.
- email: Correo electrónico del usuario.
- userType: Tipo de usuario (professional o client).
- registerDate: Fecha de registro en la plataforma.
- lastLoginDate: Fecha del último inicio de sesión.
- location: Ubicación del usuario.
- phoneNumber (opcional): Número de teléfono del usuario.
- profilePhoto (opcional): URL de la foto de perfil del usuario.

2. Perfiles Profesionales

Colección: professionalProfiles
Documento: {profileId}
Campos:
- userId: ID del usuario asociado.
- skills: Lista de habilidades o servicios ofrecidos.
- rating: Calificación promedio.
- jobsDone: Lista de trabajos realizados.
- verifiedPremium: Booleano que indica si el profesional está verificado como premium.
- offeredServices: Lista de IDs de servicios ofrecidos.
- biography (opcional): Biografía del profesional.
- availability: Lista de disponibilidades del profesional.

_ Subcolección: services

Documento: {serviceId}
Campos:
- title: Título del servicio.
- description: Descripción detallada del servicio.
- paymentMethod: Método de pago (por hora, por proyecto).
- priceType: Tipo de precio (fijo, a definir, rango).
- paymentType: Tipo de pago (sin pago, parcial, total).
- category: Categoría del servicio (ej. plomería, electricidad).
- requiredInformation (opcional): Información requerida para el servicio.
- serviceLocationModality: Modalidad de ubicación del servicio (entrega a domicilio, remoto, comercio físico).
- portfolio (opcional): URLs de trabajos realizados.

_ Subcolección: reviews

Documento: {reviewId}
Campos:
- clientId: ID del cliente que deja la reseña.
- calification: Calificación numérica.
- comment: Comentario del cliente.
- date: Fecha de la reseña.

3. Servicios

Colección: services
Documento: {serviceId}
Campos:
- title: Título del servicio.
- description: Descripción detallada del servicio.
- paymentMethod: Método de pago (por hora, por proyecto).
- priceType: Tipo de precio (fijo, a definir, rango).
- paymentType: Tipo de pago (sin pago, parcial, total).
- professionalId: ID del perfil profesional que ofrece el servicio.
- category: Categoría del servicio (ej. plomería, electricidad).
- requiredInformation (opcional): Información requerida para el servicio.
- serviceLocationModality: Modalidad de ubicación del servicio (entrega a domicilio, remoto, comercio físico).
- portfolio (opcional): URLs de trabajos realizados.

_ Subcolección: reviews

Documento: {reviewId}
Campos:
- clientId: ID del cliente que deja la reseña.
- calification: Calificación numérica.
- comment: Comentario del cliente.
- date: Fecha de la reseña.

4. Reservas

Colección: reservations
Documento: {reservationId}
Campos:
- clientId: ID del cliente que realiza la reserva.
- serviceId: ID del servicio reservado.
- reservationDate: Fecha y hora de la reserva.
- shiftId: ID del turno asociado.
- status: Estado de la reserva (pendiente, confirmada, cancelada, completada).

5. Reseñas

Colección: reviews
Documento: {reviewId}
Campos:
- serviceId: ID del servicio reseñado.
- clientId: ID del cliente que deja la reseña.
- calification: Calificación numérica.
- comment: Comentario del cliente.
- date: Fecha de la reseña.

6. Notificaciones

Colección: notifications
Documento: {notificationId}
Campos:
- userId: ID del usuario que recibe la notificación.
- message: Contenido de la notificación.
- notificationType: Tipo de notificación (nueva reserva, confirmación de reserva, cancelación de reserva, recordatorio de reserva, nueva reseña, vista de perfil, confirmación de pago).
- date: Fecha de la notificación.
- status: Estado de la notificación (leída, no leída).

7. Disponibilidad

Colección: availability
Documento: {availabilityId}
Campos:
- day: Fecha del día de disponibilidad.
- shifts: Lista de turnos disponibles.

_ Subcolección: shifts

Documento: {shiftId}
Campos:
- start: Hora de inicio del turno.
- end: Hora de fin del turno.
- length: Duración del turno.
- serviceId: ID del servicio asociado.

8. Calendario

Colección: calendars
Documento: {calendarId}
Campos:
- clientId: ID del cliente.
- professionalId: ID del profesional.

____________________________________________________________________________________________________________________

CASOS DE USO PARA ÍNDICES

1) Filtrar Usuarios por Tipo:

Consulta: Obtener todos los usuarios que sean profesionales o clientes.
Índice Necesario: Un índice en el campo tipo para filtrar rápidamente por tipo de usuario.

2) Buscar Profesionales por Palabra Clave:

Consulta: Buscar profesionales que contengan una palabra clave en sus habilidades.
Índice Necesario: Un índice en el campo skills para realizar búsquedas eficientes con array-contains.

3) Ordenar y Filtrar Servicios:

Consulta: Filtrar servicios por categoría y ordenar por precio.
Índice Necesario: Un índice compuesto en los campos categoria y precio para combinar filtrado y ordenación.

4) Consultas de Rango en Reservas:

Consulta: Obtener reservas dentro de un rango de fechas.
Índice Necesario: Un índice en el campo fechaReserva para manejar consultas de rango eficientemente.

5) Métricas y Análisis:

Consulta: Obtener métricas sobre visualización de datos de contacto o interacciones de usuarios.
Índice Necesario: Índices en los campos relevantes para realizar consultas analíticas rápidas.

____________________________________________________________________________________________________________________

CONSULTAS PARA BÚSQUEDAS FILTRADAS

1) Consulta por Tipo de Usuario:

Esta consulta sigue siendo similar, ya que el tipo de usuario sigue estando en la colección Usuarios.

const getUsersByType = async (userType) => {
  const usersRef = collection(db, "Usuarios");
  const q = query(usersRef, where("tipo", "==", userType));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

// Llamar a la función para obtener profesionales
getUsersByType("profesional");

2) Buscar Profesionales por Palabra Clave:

Ahora que los datos específicos de los profesionales están en la colección Perfiles Profesionales, la consulta debe dirigirse a esta colección.

const searchProfessionalsByKeyword = async (keyword) => {
  const profilesRef = collection(db, "PerfilesProfesionales");
  const q = query(profilesRef, where("skills", "array-contains", keyword));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

// Llamar a la función para buscar por palabra clave
searchProfessionalsByKeyword("plomería");

3) Obtener Servicios de un Profesional:

Para obtener los servicios ofrecidos por un profesional específico, puedes usar el profesionalId en la colección Servicios.

const getServicesByProfessional = async (professionalId) => {
  const servicesRef = collection(db, "Servicios");
  const q = query(servicesRef, where("profesionalId", "==", professionalId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};

// Llamar a la función para obtener servicios de un profesional
getServicesByProfessional("someProfessionalId");
