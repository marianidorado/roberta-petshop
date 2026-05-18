export interface ExcelClientRow {
   Nombre: string
  Apellido: string
  "Identificación\nSin puntos sin comas": string | number
  Ciudad: string
  Direccion: string
  Celular: string | number
}

export interface ExcelPetRow {
  "Cedula Cliente": string | number
  "Nombre Mascota": string
  "Especie (Gato, perro etc)": string
  Raza: string
  "Sexo\nMacho/Hembra": string
}

/* ==============================
   Tipos LIMPIOS para la app
================================ */

export interface CleanClient {
  cedula: string
  nombre: string
  apellido: string
  ciudad: string
  direccion: string
  celular: string
}

export interface CleanPet {
  nombre: string
  especie: string
  raza: string
  sexo: string
  cedulaCliente: string
}