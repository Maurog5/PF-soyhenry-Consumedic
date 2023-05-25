import { createContext, useState } from "react";
import axios from "axios";
import useLocalStorage from "../helpers/useLocalStorage";
import { useNavigate } from "react-router-dom";

// import {
//   URL_PATIENTS,
//   URL_DOCTORS,
//   URL_SPECIALTIES,
//   URL_SOCIALSECURITY,
//   URL_PERFILMEDICO,
//   URL_TURNOS,
//   URL_PERFILPACIENTE,
// } from '../helpers/urlVariables';

const URL_PATIENTS = process.env.REACT_APP_URL_PATIENTS;
const URL_DOCTORS = process.env.REACT_APP_URL_DOCTORS;
const URL_SPECIALTIES = process.env.REACT_APP_URL_SPECIALTIES;
const URL_SOCIALSECURITY = process.env.REACT_APP_URL_SOCIALSECURITY;
const URL_PERFILMEDICO = process.env.REACT_APP_URL_PERFILMEDICO;
const URL_MAIL = process.env.REACT_APP_URL_MAIL;
const URL_POSTAGENDA = process.env.REACT_APP_URL_POSTAGENDA;
const URL_TURNOS = process.env.REACT_APP_URL_TURNOS;
const URL_APPOINTMENTS = process.env.REACT_APP_URL_APPOINTMENTS;
const URL_PERFILPACIENTE = process.env.REACT_APP_URL_PERFILPACIENTE;
const URL_DOCUMENTOS = process.env.REACT_APP_URL_DOCUMENTOS;
const URL_OPINIONS = process.env.REACT_APP_URL_OPINIONS;

export const Context = createContext([]);
export const UtilitiesContext = createContext([]);
export const LoadingContext = createContext([]);
export const FilterContext = createContext([]);
export const SessionContext = createContext([]);

const ContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [session, setSession] = useLocalStorage("loggedUser", {
    isDoctor: false,
    token: "",
    email: "",
  }); //user es tanto paciente como doctor.

  const [selectedFilters, setSelectedFilters] = useState({
    Especialidads: [false, {}],
    ObraSocials: [false, {}],
    Cita: [false, {}],
    location: [false, {}],
  });

  const [doctorsData, setDoctorsData] = useState({
    doctors: [],
    doctorDetail: {},
    filteredDoctors: [],
    doctorOpinions: [],
    snackOk: false,
    snackOkMensaje: "",
    snackFail: false,
    snackFailMensaje: "",
    fetchDoctors: async () => {
      const response = await axios(URL_DOCTORS);
      const data = await response.data;
      setDoctorsData((prevState) => ({
        ...prevState,
        doctors: [...data],
        filteredDoctors: [...data],
      }));
    },
    fetchDoctorById: async (id) => {
      const response = await axios(`${URL_DOCTORS}/${id}`);
      const data = await response.data;
      setDoctorsData((prevState) => ({
        ...prevState,
        doctorDetail: data,
      }));
    },
    fetchDoctorByEmail: async (email) => {
      const data = (await axios(`${URL_DOCTORS}?email=${email}`)).data;
      setDoctorsData((prevState) => ({
        ...prevState,
        doctorDetail: { ...data },
      }));
      return { ...data };
    },
    deleteDoctor: async (id) => {
      try {
        await axios.delete(`${URL_DOCTORS}/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    cleanDetail: async () => {
      setDoctorsData((prevState) => ({
        ...prevState,
        doctorDetail: {},
      }));
    },
    createDoctor: async (newDoctor) => {
      try {
        const response = await axios.post(`${URL_DOCTORS}`, newDoctor);
        const data = await response.data;
        const idMedico = data.id
        const horarios = await axios.post(`${URL_POSTAGENDA}/first`,{idMedico})

        setDoctorsData((prevState) => ({
          ...prevState,
          doctorDetail: { ...data },
          snackOk: true,
          snackOkMensaje:
            "Perfil de Doctor Creado con Exito, por favor Ingrese a su cuenta creada",
        }));
        navigate(`/loginDoctor/`);
      } catch (error) {
        setDoctorsData((prevState) => ({
          ...prevState,
          snackFail: true,
          snackFailMensaje: error.response.data.message,
        }));
      }
    },
    filterDoctors: async (newFilter) => {
      setDoctorsData((prevState) => ({
        ...prevState,
        filteredDoctors: [...newFilter],
      }));
    },
    loginDoctor: async (loginData) => {
      const sessionData = (
        await axios.post(`${URL_DOCTORS}/loginDoctor`, loginData)
      ).data;
      const doctorData = await doctorsData.fetchDoctorByEmail(
        loginData.email,
        loginData.nombre,
        loginData.apellido
      );
      console.log(doctorData);
      setSession({
        ...sessionData,
        email: loginData.email,
        nombre: loginData.nombre,
        apellido: loginData.apellido,
      });
      console.log({ sessionData, doctorData });
      return { sessionData, doctorData };
    },
    putDoctor: async (doctorNewDetails) => {
      const data = await axios.put(`${URL_DOCTORS}/edit`, doctorNewDetails)
        .data;
      setDoctorsData((prevState) => ({
        ...prevState,
        doctorDetail: { ...data },
      }));
      return data;
    },
    fetchOpinions: async (id) => {
      try {
        const data = (await axios.get(`${URL_OPINIONS}/${id}`)).data;
        setDoctorsData((prevState) => ({
          ...prevState,
          doctorOpinions: [...data],
        }));
      } catch (error) {
        console.log(error.message);
      }
    },
    setSnackOk: (dato) => {
      setDoctorsData((prevState) => ({
        ...prevState,
        snackOk: dato,
      }));
    },
    setSnackOkMensaje: (dato) => {
      setDoctorsData((prevState) => ({
        ...prevState,
        snackOkMensaje: dato,
      }));
    },
    setSnackFail: (dato) => {
      setDoctorsData((prevState) => ({
        ...prevState,
        snackFail: dato,
      }));
    },
    setSnackFailMensaje: (dato) => {
      setDoctorsData((prevState) => ({
        ...prevState,
        snackFailMensaje: dato,
      }));
    },
  });

  const [patientsData, setPatientsData] = useState({
    patients: [],
    patientDetail: {},
    filteredPatients: [],
    opinions: [],
    snackOk: false,
    snackOkMensaje: "",
    snackFail: false,
    snackFailMensaje: "",
    fetchPatients: async () => {
      try {
        const data = (await axios(URL_PATIENTS)).data;
        setPatientsData((prevState) => ({
          ...prevState,
          patients: [...data],
        }));
      } catch (error) {
        console.log(error);
      }
    },
    fetchPatientByEmail: async (email) => {
      try {
        const data = (await axios(`${URL_PATIENTS}?email=${email}`)).data;
        setPatientsData((prevState) => ({
          ...prevState,
          patientDetail: { ...data },
        }));
        return { ...data };
      } catch (error) {
        console.log(error);
      }
    },
    fetchPatientById: async (id) => {
      try {
        const data = (await axios(`${URL_PATIENTS}/${id}`)).data;
        setPatientsData((prevState) => ({
          ...prevState,
          patientDetail: { ...data },
        }));
        return { ...data };
      } catch (error) {
        console.log(error);
      }
    },
    deletePatient: async (id) => {
      try {
        await axios.delete(`${URL_PATIENTS}/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    cleanDetailPaciente: async () => {
      setPatientsData((prevState) => ({
        ...prevState,
        patientDetail: {},
      }));
    },
    createPatient: async (newPatient) => {
      try {
        const data = (await axios.post(`${URL_PATIENTS}`, newPatient)).data;
        setPatientsData((prevState) => ({
          ...prevState,
          patientDetail: { ...data },
        }));
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    setSnackOk: (dato) => {
      setDoctorsData((prevState) => ({
        ...prevState,
        snackOk: dato,
      }));
    },
    setSnackOkMensaje: (dato) => {
      setPatientsData((prevState) => ({
        ...prevState,
        snackOkMensaje: dato,
      }));
    },
    setSnackFail: (dato) => {
      setPatientsData((prevState) => ({
        ...prevState,
        snackFail: dato,
      }));
    },
    setSnackFailMensaje: (dato) => {
      setPatientsData((prevState) => ({
        ...prevState,
        snackFailMensaje: dato,
      }));
    },
    // deletePatient: async (patientId) => {
    //   try {
    //     await axios.delete(`${URL_PATIENTS}/${patientId}`);
    //     setPatientsData((prevState) => ({
    //       ...prevState,
    //       patients: prevState.patients.filter(
    //         (patient) => patient.id !== patientId
    //       ),
    //       filteredPatients: prevState.filteredPatients.filter(
    //         (patient) => patient.id !== patientId
    //       ),
    //     }));
    //   } catch (error) {
    //     console.error("Error deleting patient", error);
    //   }
    // },

    postAppointment: async (datosTurno) => {
      try {
        await axios.post(`${URL_APPOINTMENTS}`, datosTurno);
      } catch (error) {
        console.log(error);
      }
    },
    loginPatient: async (loginData) => {
      if (loginData.token) {
        setSession({
          email: loginData.email,
          token: loginData.token,
          isDoctor: false,
        });

        axios
          .get(`${URL_PATIENTS}?email=${loginData.email}`)
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            if (error.response && error.response.status === 400) {
              patientsData
                .createPatient({
                  loggedFromGoogle: loginData.loggedFromGoogle,
                  email: loginData.email,
                  nombre: loginData.nombre,
                  apellido: loginData.apellido,
                })
                .then((newPatient) => {
                  return newPatient;
                })
                .catch((error) => {});
            } else {
            }
          });
      } else {
        const sessionData = (
          await axios.post(`${URL_PATIENTS}/login`, loginData)
        ).data;
        const patientData = await patientsData.fetchPatientByEmail(
          loginData.email,
          loginData.nombre,
          loginData.apellido
        );
        setSession({
          ...sessionData,
          email: loginData.email,
          nombre: loginData.nombre,
          apellido: loginData.apellido,
          token: loginData.tokenId,
        });
        return { sessionData, patientData };
      }
    },

    postOpinions: async (newOpinion) => {
      try {
        const data = (await axios.post(`${URL_OPINIONS}`, newOpinion)).data;
        return data;
      } catch (error) {}
    },

    getOpinionsByPaciente: async (id) => {
      const opinionsData = (await axios(`${URL_OPINIONS}/paciente/${id}`)).data;
      setPatientsData((prevState) => ({
        ...prevState,
        opinions: [...opinionsData],
      }));
    },
  });

  const [utilities, setUtilities] = useState({
    socialSecurity: [],
    specialties: [],
    fetchUtilities: async () => {
      const socialSecurityData = (await axios(`${URL_SOCIALSECURITY}`)).data;
      const specialtiesData = (await axios(`${URL_SPECIALTIES}`)).data;
      setUtilities((prevState) => ({
        ...prevState,
        socialSecurity: [...socialSecurityData],
        specialties: [...specialtiesData],
      }));
    },
  });

  const [panelMedico, setPanelMedico] = useState({
    pacientes: [],
    pacienteHistorial: {},
    turnos: {},
    vista: 0,

    fetchPacientes: async (id) => {
      try {
        const pacientesData = (
          await axios(`${URL_PERFILMEDICO}/${id}/pacientes`)
        ).data;
        setPanelMedico((prevState) => ({
          ...prevState,
          pacientes: [...pacientesData],
        }));
      } catch (error) {
        console.log(error.message);
      }
    },
    fetchPacienteHistorial: async (idMedico, idPaciente) => {
      const pacienteHistorialData = (
        await axios(`${URL_PERFILMEDICO}/${idMedico}/pacientes/${idPaciente}`)
      ).data;
      setPanelMedico((prevState) => ({
        ...prevState,
        pacienteHistorial: { ...pacienteHistorialData },
      }));
    },
    fetchTurnos: async (id) => {
      try {
        const turnosData = (await axios(`${URL_APPOINTMENTS}/doctor/${id}`))
          .data;
        setPanelMedico((prevState) => ({
          ...prevState,
          turnos: turnosData,
        }));
      } catch (error) {
        console.log(error.message);
      }
    },
    setVista: (vista) => {
      setPanelMedico((prevState) => ({
        ...prevState,
        vista: vista,
      }));
    },
    postDocumentosCita: async (
      idCita,
      files64,
      idMedico,
      idPaciente,
      titulo
    ) => {
      await axios.post(`${URL_PERFILMEDICO}/doctor/cita/documento`, {
        idCita,
        files64,
        idMedico,
        idPaciente,
        titulo,
      });
    },
    postRespuestaCita: async (idCita, respuesta) => {
      await axios.post(`${URL_PERFILMEDICO}/doctor/cita/respuesta`, {
        idCita,
        respuesta,
      });
    },
  });

  const [appointment, setAppointment] = useState({
    appointmentId: 0,
    doctorId: 0,
    patientId: 0,
    fecha: "",
    hora: "",
    description: "",
    pagado: false,
    createAppointment: async () => {},

    fetchAppointmentById: async () => {},

    setPayedToTrue: async () => {},
  });

  const [panelPaciente, setPanelPaciente] = useState({
    informacion: [],

    fetchPatientData: async (id) => {
      const pacientesData = (await axios(`${URL_PERFILPACIENTE}/${id}/doctors`))
        .data;
      setPanelPaciente((prevState) => ({
        ...prevState,
        informacion: [...pacientesData],
      }));
    },
    postDocumentosCita: async (
      idCita,
      files64,
      idMedico,
      idPaciente,
      titulo
    ) => {
      await axios.post(`${URL_DOCUMENTOS}`, {
        idCita,
        files64,
        idMedico,
        idPaciente,
        titulo,
      });
    },
  });

  const [panelAdmin, setPanelAdmin] = useState({
    admin: {},
    vista: 0,
    pacientes: [],
    medicos: [],
    email: 0,
    setVista: (vista) => {
      setPanelAdmin((prevState) => ({
        ...prevState,
        vista: vista,
      }));
    },
    setEmail: (email) => {
      setPanelAdmin((prevState) => ({
        ...prevState,
        email: email,
      }));
    },
  });

  const [mailer, setMailer] = useState({
    mailDoctor: "",
    mailPaciente: "",
    modal: false,
    snackOk: false,
    snackOkMensaje: "",
    snackFail: false,
    snackFailMensaje: "",
    setMailDoctor: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        mailDoctor: dato,
      }));
    },
    setMailPaciente: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        mailPaciente: dato,
      }));
    },
    setModal: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        modal: dato,
      }));
    },
    setSnackOk: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        snackOk: dato,
      }));
    },
    setSnackOkMensaje: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        snackOkMensaje: dato,
      }));
    },
    setSnackFail: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        snackFail: dato,
      }));
    },
    setSnackFailMensaje: (dato) => {
      setMailer((prevState) => ({
        ...prevState,
        snackFailMensaje: dato,
      }));
    },
  });

  return (
    <>
      <LoadingContext.Provider value={[loading, setLoading]}>
        <UtilitiesContext.Provider value={utilities}>
          <FilterContext.Provider value={[selectedFilters, setSelectedFilters]}>
            <Context.Provider
              value={[
                doctorsData, //[0]
                patientsData, //[1]
                { session, setSession }, //[2]
                panelMedico, //[3]
                appointment, //[4]
                panelPaciente, //[5]
                panelAdmin, // [6]
                mailer, //[7]
              ]}
            >
              {children}
            </Context.Provider>
          </FilterContext.Provider>
        </UtilitiesContext.Provider>
      </LoadingContext.Provider>
    </>
  );
};

export default ContextProvider;
