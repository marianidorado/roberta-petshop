"use client"

import { useMemo, useState } from "react"
import type { ServiceRecord } from "@/types/service-record"
import type { Pet } from "@/types/pet"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { format, parseISO, isWithinInterval } from "date-fns"

interface Props {
  records: ServiceRecord[]
  pets: Pet[]
}

interface ChartData {
  name: string
  total: number
}

export function BusinessDashboard({ records, pets }: Props) {

  const [startDate,setStartDate] = useState("")
  const [endDate,setEndDate] = useState("")
  const [heightRange,setHeightRange] = useState("")

  /* MAPA DE MASCOTAS */

  const petsMap = useMemo(()=>{

    const map:Record<string,Pet> = {}

    pets.forEach(p=>{
      map[p.id] = p
    })

    return map

  },[pets])

  /* FILTROS */

  const filteredRecords = useMemo(()=>{

    let data = records

    if(startDate && endDate){

      data = data.filter(record=>
        isWithinInterval(parseISO(record.entryDate),{
          start:parseISO(startDate),
          end:parseISO(endDate)
        })
      )

    }

    if(heightRange){

      data = data.filter(record=>{

        const pet = petsMap[record.petId]

        if(!pet?.heightRange) return false

        return pet.heightRange === heightRange

      })

    }

    return data

  },[records,startDate,endDate,heightRange,petsMap])

  /* KPIs */

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthRecords = filteredRecords.filter(r=>{
    const d = new Date(r.entryDate)
    return d.getMonth()===currentMonth && d.getFullYear()===currentYear
  })

  const previousMonthRecords = filteredRecords.filter(r=>{
    const d = new Date(r.entryDate)
    return d.getMonth()===currentMonth-1 && d.getFullYear()===currentYear
  })

  const servicesThisMonth = currentMonthRecords.length
  const servicesLastMonth = previousMonthRecords.length

  const growth =
    servicesLastMonth === 0
      ? 100
      : ((servicesThisMonth-servicesLastMonth)/servicesLastMonth)*100

  const uniqueClients = new Set(
    filteredRecords.map(r=>r.ownerId)
  ).size

  /* SERVICIOS */

  const servicesChart:ChartData[] = useMemo(()=>{

    const map:Record<string,number> = {}

    filteredRecords.forEach(r=>{
      map[r.serviceName] = (map[r.serviceName]||0)+1
    })

    return Object.entries(map).map(([name,total])=>({name,total}))

  },[filteredRecords])

  /* SERVICIOS RENTABLES */

  const profitableServices = servicesChart
    .sort((a,b)=>b.total-a.total)
    .slice(0,5)

  /* RESPONSABLE */

  const groomerChart:ChartData[] = useMemo(()=>{

    const map:Record<string,number> = {}

    filteredRecords.forEach(r=>{
      map[r.receivedBy] = (map[r.receivedBy]||0)+1
    })

    return Object.entries(map).map(([name,total])=>({name,total}))

  },[filteredRecords])

  /* DEMANDA POR DIA */

  const demandChart = useMemo(()=>{

    const map:Record<string,number> = {}

    filteredRecords.forEach(r=>{

      const day = format(parseISO(r.entryDate),"EEE")

      map[day] = (map[day]||0)+1

    })

    return Object.entries(map).map(([name,total])=>({name,total}))

  },[filteredRecords])

  /* HORAS PICO */

  const peakHours = useMemo(()=>{

    const map:Record<string,number> = {}

    filteredRecords.forEach(r=>{

      const hour = format(parseISO(r.entryDate),"HH")

      map[hour] = (map[hour]||0)+1

    })

    return Object.entries(map)
      .map(([name,total])=>({name,total}))
      .sort((a,b)=>a.name.localeCompare(b.name))

  },[filteredRecords])

  /* TOP RAZAS */

  const breedChart = useMemo(()=>{

    const map:Record<string,number> = {}

    pets.forEach(p=>{

      const breed = p.breed || "Sin raza"

      map[breed] = (map[breed]||0)+1

    })

    return Object.entries(map)
      .map(([name,total])=>({name,total}))
      .sort((a,b)=>b.total-a.total)
      .slice(0,5)

  },[pets])

  /* ESTATURA */

  const heightChart = useMemo(()=>{

    const ranges:Record<string,number> = {
      "0-20":0,
      "20-40":0,
      "40-60":0,
      "60-70":0,
      "70+":0
    }

    pets.forEach(p=>{

      const r = p.heightRange

      if(!r) return

      ranges[r] = ranges[r] + 1

    })

    return Object.entries(ranges).map(([name,total])=>({name,total}))

  },[pets])

  /* PREDICCION */

  const predictedNextMonth = Math.round(
    servicesThisMonth+(growth/100)*servicesThisMonth
  )

  /* EXPORTAR */

  const exportExcel = ()=>{

    const worksheet = XLSX.utils.json_to_sheet(filteredRecords)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook,worksheet,"Servicios")

    XLSX.writeFile(workbook,"reporte_servicios.xlsx")

  }

  const exportPDF = ()=>{

    const doc = new jsPDF()

    doc.text("Reporte de Servicios",14,20)

    autoTable(doc,{
      startY:30,
      head:[["Fecha","Mascota","Cliente","Servicio"]],
      body:filteredRecords.map(r=>[
        r.entryDate,
        r.petName,
        r.ownerName,
        r.serviceName
      ])
    })

    doc.save("reporte_servicios.pdf")

  }

  return(

    <div className="space-y-10">

      {/* FILTROS */}

      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <input type="date"
        value={startDate}
        onChange={e=>setStartDate(e.target.value)}
        className="border p-2 rounded-lg"/>

        <input type="date"
        value={endDate}
        onChange={e=>setEndDate(e.target.value)}
        className="border p-2 rounded-lg"/>

        <select
        value={heightRange}
        onChange={e=>setHeightRange(e.target.value)}
        className="border p-2 rounded-lg">

          <option value="">Estatura mascota</option>
          <option value="0-20">0-20 cm</option>
          <option value="20-40">20-40 cm</option>
          <option value="40-60">40-60 cm</option>
          <option value="60-70">60-70 cm</option>
          <option value="70+">Mayor 70 cm</option>

        </select>

        <button
        onClick={()=>{
          setStartDate("")
          setEndDate("")
          setHeightRange("")
        }}
        className="bg-gray-200 rounded-lg px-4 py-2">

          Limpiar

        </button>

      </div>

      {/* KPIs */}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

        <Card title="Servicios este mes" value={servicesThisMonth}/>
        <Card title="Mes anterior" value={servicesLastMonth}/>
        <Card title="Crecimiento" value={`${growth.toFixed(1)}%`}/>
        <Card title="Clientes atendidos" value={uniqueClients}/>

      </div>

      {/* GRAFICOS */}

      <ChartCard title="Servicios más realizados">
        <BarChart data={servicesChart}>
          <XAxis dataKey="name"/>
          <YAxis allowDecimals={false}/>
          <Tooltip/>
          <Bar dataKey="total"/>
        </BarChart>
      </ChartCard>

      <ChartCard title="Servicios más rentables">
        <BarChart data={profitableServices}>
          <XAxis dataKey="name"/>
          <YAxis allowDecimals={false}/>
          <Tooltip/>
          <Bar dataKey="total"/>
        </BarChart>
      </ChartCard>

      <ChartCard title="Horas pico del negocio">
        <LineChart data={peakHours}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis allowDecimals={false}/>
          <Tooltip/>
          <Line dataKey="total"/>
        </LineChart>
      </ChartCard>

      <ChartCard title="Top razas atendidas">
        <BarChart data={breedChart}>
          <XAxis dataKey="name"/>
          <YAxis allowDecimals={false}/>
          <Tooltip/>
          <Bar dataKey="total"/>
        </BarChart>
      </ChartCard>

      <ChartCard title="Estatura de mascotas">
        <BarChart data={heightChart}>
          <XAxis dataKey="name"/>
          <YAxis allowDecimals={false}/>
          <Tooltip/>
          <Bar dataKey="total"/>
        </BarChart>
      </ChartCard>

      {/* PREDICCION */}

      <div className="bg-white p-6 rounded-xl shadow text-center">

        <p className="text-sm text-gray-500">
          Predicción próximo mes
        </p>

        <p className="text-3xl font-bold text-amber-600">
          {predictedNextMonth} servicios estimados
        </p>

      </div>

      {/* EXPORTAR */}

      <div className="sticky bottom-0 bg-white p-4 flex flex-col sm:flex-row gap-4 justify-end border-t shadow-lg">

        <button
        onClick={exportExcel}
        className="bg-amber-500 text-white px-6 py-2 rounded-lg">
          Descargar Excel
        </button>

        <button
        onClick={exportPDF}
        className="bg-gray-800 text-white px-6 py-2 rounded-lg">
          Descargar PDF
        </button>

      </div>

    </div>
  )
}

/* COMPONENTES */

function Card({title,value}:{title:string,value:string|number}){

  return(
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-amber-600">{value}</p>
    </div>
  )
}

function ChartCard({title,children}:{title:string,children:React.ReactElement}){

  return(
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300} className="min-h-[220px]">
        {children}
      </ResponsiveContainer>
    </div>
  )
}