import { createOwner } from "@/lib/firebase/owners"
import { createPet } from "@/lib/firebase/pets"
import { ExcelClientRow, ExcelPetRow } from "./types"
import { PetSpecies, PetSex } from "@/types/pet"
import { CleanClient, CleanPet } from "./types"

/* ===============================
   Convertir especie Excel → PetSpecies
================================ */

function mapSpecies(value: string): PetSpecies {

  const v = value?.toLowerCase() ?? ""

  if (v.includes("gato") || v.includes("felino"))
    return "Gato"

  if (v.includes("perro") || v.includes("canino"))
    return "Perro"

  return "Otro"
}

/* ===============================
   Convertir sexo Excel → PetSex
================================ */

function mapSex(value: string): PetSex {

  const v = value?.toLowerCase() ?? ""

  if (v.startsWith("f") || v.includes("hembra"))
    return "Hembra"

  return "Macho"
}

export async function importToFirebase(
  clients: CleanClient[],
  pets: CleanPet[]
) {

  const ownerMap = new Map<string, string>()

  /* =========================
     Crear OWNERS
  ========================= */

  for (const client of clients) {

  const ownerId = await createOwner({
    name: client.nombre,
    lastName: client.apellido,
    document: client.cedula,
    city: client.ciudad,
    address: client.direccion,
    phone: client.celular,
    birthDate: "",
    email: "",
    notes: "",
  })

  ownerMap.set(client.cedula, ownerId)
}

  /* =========================
     Crear PETS
  ========================= */

  for (const pet of pets) {

  const ownerId = ownerMap.get(pet.cedulaCliente)

  if (!ownerId) continue

  await createPet({
    id: "",
    ownerId,
    name: pet.nombre,
    species: mapSpecies(pet.especie),
    breed: pet.raza,
    sex: mapSex(pet.sexo),
    heightCm: 0,
    vaccinesUpToDate: false,
    birthDate: "",
    color: "",
    notes: "",
  })
}}