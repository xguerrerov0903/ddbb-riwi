import { get } from "./crud.js";

const tbody = document.getElementById("ConsultasFiltros");

  const newTbody = tbody.cloneNode(true);
  tbody.parentNode.replaceChild(newTbody, tbody);

  newTbody.addEventListener("click", async function (event) {
    event.preventDefault();
    // Check if the clicked element is a button
    if (event.target.tagName !== "BUTTON") return;

    if (action === "citasMedicoFecha") {
      printCitasMedicoFecha();
    } else if (action === "pacientes3Citas") {
    printPacientes3Citas();
    } else if (action === "medicosCitasMes") {
        printMedicosCitasMes();
    } else if (action === "metodosPagoFechas") {
        printMetodosPagoFechas();
    }
 });
 
 async function printCitasMedicoFecha() {
    console.log("Citas por Medico y Fecha");
    const id_medico = document.getElementById("id_medico").value;
    const fecha_inicio = document.getElementById("fecha_inicio").value;
    const fecha_fin = document.getElementById("fecha_fin").value;
    const CMFbody = document.getElementById("TablaCitasMedicoFecha"); 
    
    


    const CMFdata = await get(`http://localhost:3000/consultas/citas-por-medico/${id_medico}/${fecha_inicio}/${fecha_fin}`);

    if (!Array.isArray(CMFdata) || CMFdata.length === 0) {
      CMFbody.innerHTML = `<tr><td colspan="7">Sin resultados</td></tr>`;
      return;}
    
    CMFbody.innerHTML = CMFdata
    .map(
        (r) => `
        <tr>
        <td>${r.Medico}</td>
        <td>${r.especialidad}</td>
        <td>${r.id_cita}</td>
        <td>${r.id_paciente}</td>
        <td>${r.id_medico}</td>
        <td>${r.fecha}</td>
        <td>${r.hora}</td>
        <td>${r.motivo ?? ""}</td>
        <td>${r.descripcion ?? ""}</td>
        <td>${r.ubicacion ?? ""}</td>
        <td>${r.metodo_pago ?? ""}</td>
        <td>${r.estatus ?? ""}</td>
      </tr>`
  ).join("");


}

 async function printPacientes3Citas() {
    console.log("Pacientes con 3 o más citas");
    const P3Cbody = document.getElementById("TablaPacientes3Citas");
    const P3Cdata = await get(`http://localhost:3000/consultas/pacientes-frecuentes`)
    
    if (!Array.isArray(P3Cdata) || P3Cdata.length === 0) {
      P3Cbody.innerHTML = `<tr><td colspan="7">Sin resultados</td></tr>`;
      return;}
    
    P3Cbody.innerHTML = P3Cdata
    .map(
        (r) => `
        <tr>
        <td>${r.id_paciente}</td>
        <td>${r.nombre}</td>
        <td>${r.email}</td>
        <td>${r.Total_citas}</td>
      </tr>`
  ).join("");
    
}

 async function printMedicosCitasMes() {
    console.log("Médico por citas en el último mes");
    const MCMdata = await get(`http://localhost:3000/consultas/medicos-citas-mes`)
    const MCMbody = document.getElementById("TablaMedicosCitasMes");
    if (!Array.isArray(MCMdata) || MCMdata.length === 0) {
      MCMbody.innerHTML = `<tr><td colspan="7">Sin resultados</td></tr>`;
      return;}
    
    MCMbody.innerHTML = MCMdata
    .map(
        (r) => `
        <tr>
        <td>${r.id_medico}</td>
        <td>${r.nombre}</td>
        <td>${r.especialidad}</td>
        <td>${r.Total_citas}</td>
      </tr>`
  ).join("");
}

 async function printMetodosPagoFechas() {
    console.log("Métodos de pago por fecha");
    const fecha_inicio = document.getElementById("fecha_inicio_pago").value;
    const fecha_fin = document.getElementById("fecha_fin_pago").value;
    const MPFdata = await get(`http://localhost:3000/consultas/pagos-por-metodo/${fecha_inicio}/${fecha_fin}`)
    const MPFbody = document.getElementById("TablaMetodosPagoFechas");
    if (!Array.isArray(MPFdata) || MPFdata.length === 0) {
      MPFbody.innerHTML = `<tr><td colspan="7">Sin resultados</td></tr>`;
      return;}
    
    MPFbody.innerHTML = MPFdata
    .map(
        (r) => `
        <tr>
        <td>${r.metodo_pago}</td>
        <td>${r.Total_citas}</td>
      </tr>`
  ).join("");
}
