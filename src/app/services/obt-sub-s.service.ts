import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ObtSubSService {
    estado: boolean;
    cargando: boolean = false;
    comentario: string = '';

    notificationSetTabs$ = new Subject<boolean>();
    notificationSetTabs2$ = new Subject<boolean>();
    notificationSetTabs3$ = new Subject<boolean>();

    calle: string = '';
    numero: number;
    portal: string = '';
    escalera: string = '';
    piso: string = '';
    puerta: string = '';
    codigo_postal: string = '';
    city: string = '';
    anonimusName: string = '';
    anonimusLastName: string = '';

    SolicitudesList: TaskModel[];
    ContaratadosList: TaskModel[];
    HistorialList: TaskModel[];

    titulo: string = '';
    dat: string;

    tim: Date;

    nombre: string = '';
    telefono: number;
    Fech_nacimiento: string = '';
    correo: string = '';
    contraseña: string = '';
    contraseñaConfirmada: string = '';

    longitud: number;
    latitud: number;
    coordenadas: boolean = false;
    ruta: string = '';
    selecfoto: boolean = false;
    radiobuton: boolean = false;
    cantidad_solicitud: number;

    //-----------------------------------------------------------

    sub_servicio_activo: string = '';
    detalles: boolean = false;
    mapType: boolean = false;

    //-----------------------------------------------------------

    i: number = 0;
    idString: String;
    subServicioActual: string;
    /*
    foto0:string = '../../../assets/fotoadd.png'; */
    fotoRegistro: string = '../../../assets/images/registro.svg';

    foto0: string = '';
    foto1: string = '';
    foto2: string = '';
    foto00: string = '';
    foto11: string = '';
    foto22: string = '';

    constructor() {
        this.SolicitudesList = [];
        this.ContaratadosList = [];
        this.HistorialList = [];

        this.foto00 = '/assets/images/fotoadd.png';
        this.foto11 = '/assets/images/fotoadd.png';
        this.foto22 = '/assets/images/fotoadd.png';
    }

    setMapType(type: boolean) {
        this.mapType = type;
    }

    getMapType() {
        return this.mapType;
    }

    deleteFields() {
        this.foto00 = '/assets/images/fotoadd.png';
        this.foto11 = '/assets/images/fotoadd.png';
        this.foto22 = '/assets/images/fotoadd.png';

        this.calle = '';
        this.numero;
        this.portal = '';
        this.escalera = '';
        this.piso = '';
        this.puerta = '';
        this.codigo_postal = '';
        this.city = '';
        this.anonimusName = '';
        this.anonimusLastName = '';
        this.comentario = '';

        this.titulo = '';

        this.nombre = '';
        this.subServicioActual = '';
        this.longitud = 0;
        this.latitud = 0;
        this.coordenadas = false;
        this.radiobuton = false;
    }

    setCity(city: string) {
        this.city = city;
    }

    getCity() {
        return this.city;
    }

    setAnonimusName(name: string) {
        this.anonimusName = name;
    }

    getAnonimusName() {
        return this.anonimusName;
    }

    setAnonimusLastName(lastName: string) {
        this.anonimusLastName = lastName;
    }

    getAnonimusLastName() {
        return this.anonimusLastName;
    }

    getNotificationSetTab$(): Observable<boolean> {
        return this.notificationSetTabs$.asObservable();
    }

    getNotificationSetTab2$(): Observable<boolean> {
        return this.notificationSetTabs2$.asObservable();
    }

    getNotificationSetTab3$(): Observable<boolean> {
        return this.notificationSetTabs3$.asObservable();
    }

    setSolicitudeList(solicitudesList: TaskModel[]) {
        this.SolicitudesList = solicitudesList;
        this.notificationSetTabs$.next(true);
    }

    setContratadosList(contratadosList: TaskModel[]) {
        this.ContaratadosList = contratadosList;
        this.notificationSetTabs2$.next(true);
    }

    setHistorialList(historialList: TaskModel[]) {
        this.HistorialList = historialList;
        this.notificationSetTabs3$.next(true);
    }

    getSolicitudeList() {
        return this.SolicitudesList;
    }

    getContratadosList() {
        return this.ContaratadosList;
    }

    getHistorialList() {
        return this.HistorialList;
    }

    setnombre(n: string) {
        this.nombre = n;
    }
    getnombre() {
        return this.nombre;
    }

    setcorreo(c: string) {
        this.correo = c;
    }

    getcorreo() {
        return this.correo;
    }

    setcontraseña(c: string) {
        this.contraseña = c;
    }

    getcontraseña() {
        return this.contraseña;
    }

    setcontraseñaConfirmafa(c: string) {
        this.contraseñaConfirmada = c;
    }

    getcontraseñaConfirmafa() {
        return this.contraseñaConfirmada;
    }

    setfecha(f) {
        this.Fech_nacimiento = f;
    }

    getfecha() {
        return this.Fech_nacimiento;
    }

    settelefono(t) {
        this.telefono = t;
    }
    gettelefono() {
        return this.telefono;
    }

    setUtiles(v: boolean) {
        this.estado = v;
    }

    getUtiles() {
        return this.estado;
    }

    setcomentario(c: string) {
        this.comentario = c;
    }

    getcomentario() {
        return this.comentario;
    }

    setcalle(v1: string) {
        this.calle = v1;
    }
    getcalle() {
        return this.calle;
    }

    setescalera(v1: string) {
        this.escalera = v1;
    }
    getescalera() {
        return this.escalera;
    }

    setportal(v1: string) {
        this.portal = v1;
    }
    setpuerta(v1: string) {
        this.puerta = v1;
    }
    setcod_postal(v1: string) {
        this.codigo_postal = v1;
    }
    setpiso(v1: string) {
        this.piso = v1;
    }
    setnumero(v1: number) {
        this.numero = v1;
    }

    getportal() {
        return this.portal;
    }
    getpuerta() {
        return this.puerta;
    }
    getcod_postal() {
        return this.codigo_postal;
    }
    getpiso() {
        return this.piso;
    }
    getnumero() {
        return this.numero;
    }

    setServ(valor: string) {
        this.subServicioActual = valor;
    }

    getServ() {
        return this.subServicioActual;
    }

    setTitulo(t: string) {
        this.titulo = t;
    }
    gettitulo() {
        return this.titulo;
    }

    setCalendarioD(d: string) {
        this.dat = d;
    }

    setCalendarioT(t: Date) {
        this.tim = t;
    }
    getCalendarioD() {
        return this.dat;
    }

    getCalendarioT() {
        return this.tim;
    }

    setLongitud(lon: number) {
        this.longitud = lon;
    }

    getlongitud() {
        return this.longitud;
    }

    setLatitud(lat: number) {
        this.latitud = lat;
    }

    getlatitud() {
        return this.latitud;
    }

    //--mas

    setcoordenada(c: boolean) {
        this.coordenadas = c;
    }

    getcoordenada() {
        return this.coordenadas;
    }

    setfoto0(f0: string) {
        this.foto0 = f0;
    }

    setfoto00(f0: string) {
        this.foto00 = f0;
    }
    setfoto1(f1: string) {
        this.foto1 = f1;
    }
    setfotoRegis(fr: string) {
        this.fotoRegistro = fr;
    }
    getfotoRegis() {
        return this.fotoRegistro;
    }
    setfoto11(f0: string) {
        this.foto11 = f0;
    }
    setfoto2(f2: string) {
        this.foto2 = f2;
    }
    setfoto22(f0: string) {
        this.foto22 = f0;
    }

    getfoto0() {
        return this.foto0;
    }

    getfoto00() {
        return this.foto00;
    }

    getfoto1() {
        return this.foto1;
    }
    getfoto11() {
        return this.foto11;
    }

    getfoto2() {
        return this.foto2;
    }
    getfoto22() {
        return this.foto22;
    }

    setruta(r) {
        this.ruta = r;
    }

    getruta() {
        return this.ruta;
    }

    setselectfoto(f: boolean) {
        this.selecfoto = f;
    }

    getselectfoto() {
        return this.selecfoto;
    }

    setradiobuton(r: boolean) {
        this.radiobuton = r;
    }

    getradiobuton() {
        return this.radiobuton;
    }

    setcargando(c) {
        this.cargando = c;
    }

    getcargando() {
        return this.cargando;
    }

    set_cantidad_solicitud(s: number) {
        this.cantidad_solicitud = s;
        console.log('entre al set', this.cantidad_solicitud);
    }

    get_cantidad_solicitud() {
        return this.cantidad_solicitud;
    }

    //-------------------------------------------------------------------------

    setposicion(i: number) {
        this.i;
    }

    getposicion() {
        return this.i;
    }

    setidString(id: string) {
        this.idString = id;
    }

    getidString() {
        return this.idString;
    }

    setDatoN(v1: string) {
        this.nombre = v1;
    }

    set_sub_servicio_activo(sub) {
        this.sub_servicio_activo = sub;
    }

    get_sub_servicio_activo() {
        return this.sub_servicio_activo;
    }
    /* setfotovacia(f){
  this.fotovacia=f
}*/

    set_Detalles(temp: boolean) {
        /*  */
        this.detalles = temp;
    }

    get_Detalles() {
        return this.detalles;
    }
}
