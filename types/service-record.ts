  export interface ServiceRecordSummary {
    id: string 
    serviceId: string
    serviceName: string
    entryDate: string
    specifications?: Record<string, string>
    observations?: string
  }
  export interface ServiceRecord {
    id: string

    /* ===============================
    * Relaciones
    * =============================== */
    petId: string
    petName: string

    ownerId: string
    ownerName: string

    /* ===============================
    * Ingreso
    * =============================== */
    entryDate: string       // YYYY-MM-DD
    entryTime: string       // HH:mm
    receivedBy: string      // Nombre del colaborador que recibe la mascota

    /* ===============================
    * Servicio realizado
    * =============================== */
    serviceId: string
    serviceName: string

    /**
     * Especificaciones del servicio
     * Ej:
     * {
     *   bikini: "medio",
     *   cara: "osito",
     *   cuchilla: "#7"
     * }
     */
    specifications?: Record<string, string>

    observations?: string

    /* ===============================
    * Egreso
    * =============================== */
    exitTime?: string        // HH:mm
    ownerSignature?: string // Base64 / URL / referencia a archivo

    /* ===============================
    * Estado
    * =============================== */
    completed: boolean
  }